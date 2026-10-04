/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnquiryRecord, EnquiryStatus } from '../types';
import {
  safeLocalStorage,
  safeSessionStorage,
  safeStorageGetJson,
  safeStorageSetJson,
} from '../utils/safeStorage';

export const OFFICIAL_ADMIN_EMAIL = 'dhakanightmarket@gmail.com';
const ENQUIRIES_STORAGE_KEY = 'dnm_enquiries_v1';

export function generateMailtoUrl(subject: string, body: string): string {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${OFFICIAL_ADMIN_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;
}

export function getLocalEnquiries(): EnquiryRecord[] {
  try {
    const list = safeStorageGetJson<EnquiryRecord[] | null>(safeLocalStorage, ENQUIRIES_STORAGE_KEY, null);
    if (Array.isArray(list)) return list;
  } catch (e) {
    console.warn('Failed to read enquiries from storage:', e);
  }
  return [];
}

export function saveLocalEnquiries(list: EnquiryRecord[]): void {
  try {
    safeStorageSetJson(safeLocalStorage, ENQUIRIES_STORAGE_KEY, list);
  } catch (e) {
    console.warn('Failed to save enquiries to storage:', e);
  }
}

export async function recordEnquiry(
  record: Omit<EnquiryRecord, 'id' | 'submittedAt' | 'status' | 'sentToMail'>
): Promise<EnquiryRecord> {
  const newEnquiry: EnquiryRecord = {
    ...record,
    id: `ENQ-${Date.now().toString().slice(-6)}`,
    submittedAt: new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    status: 'new',
    sentToMail: OFFICIAL_ADMIN_EMAIL,
  };

  // Save to local storage
  const current = getLocalEnquiries();
  saveLocalEnquiries([newEnquiry, ...current]);

  // Attempt to save to backend API if available
  try {
    await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEnquiry),
    });
  } catch {
    // Backend API optional in static mode
  }

  return newEnquiry;
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const token = safeSessionStorage.getItem('dnm_admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // Graceful fallback
  }
  return headers;
}

export async function fetchAllEnquiries(): Promise<EnquiryRecord[]> {
  try {
    const headers = getAuthHeaders();
    const res = await fetch('/api/enquiries', { headers });
    if (res.status === 401 || res.status === 403) {
      try {
        safeSessionStorage.removeItem('dnm_admin_token');
        safeSessionStorage.removeItem('dnm_admin_session');
      } catch {}
      throw new Error('Unauthorized admin session');
    }
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        saveLocalEnquiries(data);
        return data;
      }
    }
  } catch (err: any) {
    if (err.message === 'Unauthorized admin session') {
      throw err;
    }
    // Fallback to local
  }
  return getLocalEnquiries();
}

export async function updateEnquiryStatus(
  id: string,
  newStatus: EnquiryStatus
): Promise<void> {
  const list = getLocalEnquiries();
  const updated = list.map((item) =>
    item.id === id ? { ...item, status: newStatus } : item
  );
  saveLocalEnquiries(updated);

  try {
    await fetch(`/api/enquiries/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus }),
    });
  } catch {
    // Static fallback
  }
}

export async function deleteEnquiry(id: string): Promise<void> {
  const list = getLocalEnquiries();
  const filtered = list.filter((item) => item.id !== id);
  saveLocalEnquiries(filtered);

  try {
    await fetch(`/api/enquiries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  } catch {
    // Static fallback
  }
}

// Typed submission handlers
export async function submitVendorEnquiry(data: {
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  category: string;
  preferredEvent: string;
  stallPreference: string;
  notes: string;
}) {
  const subject = `[Vendor Application] ${data.businessName} - Dhaka Night Market`;
  const body = `Official Vendor Application for Dhaka Night Market:
--------------------------------------------------
Brand/Business: ${data.businessName}
Contact Person: ${data.contactName}
Phone: ${data.phone}
Email: ${data.email}
Product Category: ${data.category}
Target Event: ${data.preferredEvent}
Stall Preference: ${data.stallPreference}

Brand Profile & Requirements:
${data.notes}
--------------------------------------------------
Forwarded to: ${OFFICIAL_ADMIN_EMAIL}`;

  const mailtoUrl = generateMailtoUrl(subject, body);

  const enquiry = await recordEnquiry({
    type: 'vendor',
    title: `Vendor Application: ${data.businessName}`,
    businessOrOrg: data.businessName,
    contactName: data.contactName,
    phone: data.phone,
    email: data.email,
    categoryOrType: data.category,
    preferredEventOrDetails: `Event: ${data.preferredEvent} • Stall: ${data.stallPreference}`,
    notesOrMessage: data.notes,
  });

  return { enquiry, mailtoUrl };
}

export async function submitPartnerEnquiry(data: {
  organizationName: string;
  contactPerson: string;
  designation?: string;
  phone: string;
  email: string;
  partnershipType: string;
  message: string;
}) {
  const subject = `[Partner & Sponsor Inquiry] ${data.organizationName} - Dhaka Night Market`;
  const body = `Official Partner & Sponsor Enquiry:
--------------------------------------------------
Organization: ${data.organizationName}
Contact Person: ${data.contactPerson} (${data.designation || 'Representative'})
Phone: ${data.phone}
Email: ${data.email}
Partnership Category: ${data.partnershipType}

Collaboration Scope:
${data.message}
--------------------------------------------------
Forwarded to: ${OFFICIAL_ADMIN_EMAIL}`;

  const mailtoUrl = generateMailtoUrl(subject, body);

  const enquiry = await recordEnquiry({
    type: 'partner',
    title: `Partner Inquiry: ${data.organizationName}`,
    businessOrOrg: data.organizationName,
    contactName: `${data.contactPerson}${data.designation ? ` (${data.designation})` : ''}`,
    phone: data.phone,
    email: data.email,
    categoryOrType: data.partnershipType,
    notesOrMessage: data.message,
  });

  return { enquiry, mailtoUrl };
}

export async function submitContactEnquiry(data: {
  name: string;
  email: string;
  phone: string;
  enquiryType: string;
  subject: string;
  message: string;
}) {
  const subject = `[General Contact - ${data.enquiryType.toUpperCase()}] ${data.subject || 'Inquiry'}`;
  const body = `General Contact Form Submission:
--------------------------------------------------
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Enquiry Type: ${data.enquiryType}
Subject: ${data.subject}

Message:
${data.message}
--------------------------------------------------
Forwarded to: ${OFFICIAL_ADMIN_EMAIL}`;

  const mailtoUrl = generateMailtoUrl(subject, body);

  const enquiry = await recordEnquiry({
    type: 'contact',
    title: data.subject || `${data.enquiryType.toUpperCase()} Inquiry`,
    businessOrOrg: data.name,
    contactName: data.name,
    phone: data.phone,
    email: data.email,
    categoryOrType: data.enquiryType,
    notesOrMessage: data.message,
  });

  return { enquiry, mailtoUrl };
}
