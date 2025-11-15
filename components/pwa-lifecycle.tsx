'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/pwa/register-sw';

export function PWALifecycle() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
