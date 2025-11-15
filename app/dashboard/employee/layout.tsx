"use client";

import { EmployeeHeader } from "@/components/employee/Header";
import { MobileNav } from "@/components/employee/MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (user.role !== "EMPLOYEE") {
        // Redirect non-employees to their appropriate dashboard
        if (user.role === "ADMIN" || user.role === "MANAGER") {
          router.push("/dashboard/admin");
        } else {
          router.push("/");
        }
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "EMPLOYEE") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 md:pb-0">
      <EmployeeHeader />
      <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
      <MobileNav />
    </div>
  );
}
