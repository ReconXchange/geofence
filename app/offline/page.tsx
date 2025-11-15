export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="text-center max-w-md">
        <svg
          className="w-24 h-24 text-slate-300 mx-auto mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          You&apos;re Offline
        </h1>
        <p className="text-slate-600 mb-6">
          It looks like you&apos;ve lost your internet connection. Some features may
          be limited until you&apos;re back online.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
