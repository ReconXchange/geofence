import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">TrackShift</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Employee Time & Location Tracking
          </p>
        </div>
        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="block w-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
