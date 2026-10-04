/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './AdminApp';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary fallbackTitle="Admin Portal Error" fallbackMessage="An error occurred in the Admin Portal. Please reload the page.">
        <AdminApp />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
