import React, { useEffect } from 'react';

export default function BugTracker() {
  useEffect(() => {
    const reportError = (payload) => {
      const existing = JSON.parse(localStorage.getItem('bugReports') || '[]');
      existing.push({ ...payload, at: new Date().toISOString(), userAgent: navigator.userAgent });
      localStorage.setItem('bugReports', JSON.stringify(existing));
    };

    const handleError = (evt) => {
      reportError({
        source: 'window',
        message: evt.message,
        stack: evt.error?.stack,
        file: evt.filename,
        line: evt.lineno,
      });
    };

    const handleRejection = (evt) => {
      reportError({
        source: 'promise',
        message: evt.reason?.message || String(evt.reason),
        stack: evt.reason?.stack,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return null;
}
