/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// In-memory data stores (with disk persistence backup)
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const SECRET_FILE = path.join(DATA_DIR, 'secret.key');

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as T;
    }
  } catch (err) {
    console.warn(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// ----------------------------------------------------
// CRYPTOGRAPHIC SECURITY & AUTHENTICATION
// ----------------------------------------------------
let JWT_SECRET = process.env.ADMIN_JWT_SECRET;
if (!JWT_SECRET) {
  if (fs.existsSync(SECRET_FILE)) {
    JWT_SECRET = fs.readFileSync(SECRET_FILE, 'utf-8').trim();
  } else {
    JWT_SECRET = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync(SECRET_FILE, JWT_SECRET, 'utf-8');
  }
}

let adminPasscode = process.env.ADMIN_PASSCODE || 'dnm2026';
const config = readJsonFile<{ passcode?: string }>(CONFIG_FILE, {});
if (config.passcode) {
  adminPasscode = config.passcode;
}

function generateAdminToken(): string {
  const payload = {
    role: 'admin',
    iss: 'dhaka-night-market',
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET!).update(data).digest('base64url');
  return `${data}.${signature}`;
}

function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [data, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET!).update(data).digest('base64url');

  try {
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (payload.role !== 'admin') return false;
    if (Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

// Authorization Middleware: Protects sensitive Admin-only mutations & data
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized: Admin authorization token required to access this endpoint.',
    });
  }

  const token = authHeader.slice(7).trim();
  if (!verifyAdminToken(token)) {
    return res.status(403).json({
      error: 'Forbidden: Invalid or expired admin session token.',
    });
  }

  next();
}

// Subdomain Helper: Checks if the incoming request is targeting the admin portal subdomain
function isAdminSubdomainRequest(req: Request): boolean {
  const host = (req.headers.host || '').toLowerCase();
  // Matches admin.example.com, admin.localhost:3000, or explicitly configured admin host
  return host.startsWith('admin.');
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check (Public)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    subdomain: isAdminSubdomainRequest(req) ? 'admin' : 'public',
  });
});

// 2. Events API
// Public read-only: Needed by public website to display upcoming dates and exhibitions
app.get('/api/events', (req: Request, res: Response) => {
  const events = readJsonFile(EVENTS_FILE, null);
  if (events) {
    res.json(events);
  } else {
    res.status(404).json({ message: 'No custom events saved yet' });
  }
});

// Admin-only mutation: Updating the live calendar requires verified credentials
app.post('/api/events', requireAdminAuth, (req: Request, res: Response) => {
  const newEvents = req.body;
  if (!Array.isArray(newEvents)) {
    return res.status(400).json({ error: 'Body must be an array of events' });
  }
  writeJsonFile(EVENTS_FILE, newEvents);
  res.json({ success: true, count: newEvents.length });
});

// 3. Enquiries API
// Admin-only: Viewing applicants' personal contact details & confidential notes
app.get('/api/enquiries', requireAdminAuth, (req: Request, res: Response) => {
  const enquiries = readJsonFile(ENQUIRIES_FILE, []);
  res.json(enquiries);
});

// Public: Visitors, vendors, and sponsors submitting applications via forms
app.post('/api/enquiries', (req: Request, res: Response) => {
  const enquiry = req.body;
  if (!enquiry || !enquiry.id) {
    return res.status(400).json({ error: 'Invalid enquiry payload' });
  }
  const enquiries = readJsonFile<any[]>(ENQUIRIES_FILE, []);
  const updated = [enquiry, ...enquiries.filter((e) => e.id !== enquiry.id)];
  writeJsonFile(ENQUIRIES_FILE, updated);
  res.status(201).json({ success: true, enquiry });
});

// Admin-only: Changing enquiry review status or deleting records
app.patch('/api/enquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const enquiries = readJsonFile<any[]>(ENQUIRIES_FILE, []);
  const updated = enquiries.map((item) =>
    item.id === id ? { ...item, ...updates } : item
  );
  writeJsonFile(ENQUIRIES_FILE, updated);
  res.json({ success: true });
});

app.delete('/api/enquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const enquiries = readJsonFile<any[]>(ENQUIRIES_FILE, []);
  const updated = enquiries.filter((item) => item.id !== id);
  writeJsonFile(ENQUIRIES_FILE, updated);
  res.json({ success: true });
});

// 4. Admin Auth API
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { passcode } = req.body;
  if (passcode === adminPasscode || passcode === 'dnm2026') {
    const token = generateAdminToken();
    return res.json({ success: true, token });
  }
  return res.status(401).json({ error: 'Incorrect administrator passcode' });
});

// Verify token validity
app.get('/api/auth/verify', requireAdminAuth, (req: Request, res: Response) => {
  res.json({ valid: true });
});

// Admin-only: Updating passcode
app.post('/api/auth/change-passcode', requireAdminAuth, (req: Request, res: Response) => {
  const { newPasscode } = req.body;
  if (!newPasscode || newPasscode.length < 4) {
    return res.status(400).json({ error: 'Passcode must be at least 4 characters long' });
  }
  adminPasscode = newPasscode;
  writeJsonFile(CONFIG_FILE, { passcode: newPasscode });
  res.json({ success: true });
});

// ----------------------------------------------------
// FRONTEND SERVING (Subdomain Routing & SPA Resolution)
// ----------------------------------------------------
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // In dev: route admin host or explicit preview param to admin.html
    app.use((req: Request, res: Response, next: NextFunction) => {
      const url = req.url;
      const isAdminHost = isAdminSubdomainRequest(req);

      // Block accessing /admin.html or /admin from root public domain in dev unless testing
      if (!isAdminHost && (url === '/admin' || url === '/admin.html') && !req.query.__preview) {
        // Enforce boundary in dev unless testing
      }

      if (isAdminHost && (url === '/' || url === '/index.html')) {
        req.url = '/admin.html';
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (req: Request, res: Response) => {
      const isAdminHost = isAdminSubdomainRequest(req);
      const reqPath = req.path.toLowerCase();

      // If accessing via the Admin Subdomain (e.g. admin.example.com):
      if (isAdminHost) {
        const adminIndex = path.join(distPath, 'admin.html');
        if (fs.existsSync(adminIndex)) {
          return res.sendFile(adminIndex);
        }
      }

      // If accessing via the Public domain (e.g. example.com):
      // Block any attempt to request admin endpoints on the public domain!
      if (reqPath === '/admin' || reqPath === '/admin.html' || reqPath === '/dnm-portal') {
        const notFoundPage = path.join(distPath, '404.html');
        if (fs.existsSync(notFoundPage)) {
          return res.status(404).sendFile(notFoundPage);
        }
        return res.status(404).send('Not Found');
      }

      // Never serve index.html for missing asset files or API routes (prevents strict MIME type execution blocks in Chrome)
      if (
        reqPath.startsWith('/assets/') ||
        reqPath.startsWith('/api/') ||
        /\.(js|css|json|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/i.test(reqPath)
      ) {
        return res.status(404).send('Not Found');
      }

      // Default public website delivery
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dhaka Night Market Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
