import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            TrackShift
          </h1>
          <p className="text-lg text-slate-600">
            Employee Time & Location Tracking
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="block w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="block w-full bg-white text-primary-600 py-3 px-6 rounded-lg font-medium border-2 border-primary-600 hover:bg-primary-50 transition-colors"
          >
            Create Account
          </Link>
        </div>

        <div className="pt-8 text-sm text-slate-500">
          <p>Mobile-first PWA for managing schedules and attendance</p>
        </div>
      </div>
    </div>
  );
}
