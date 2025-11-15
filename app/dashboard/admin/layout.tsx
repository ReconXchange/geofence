"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import { AdminMobileNav } from "@/components/admin/MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
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
      } else if (user.role !== "ADMIN" && user.role !== "MANAGER") {
        // Redirect non-admins to their appropriate dashboard
        if (user.role === "EMPLOYEE") {
          router.push("/dashboard/employee");
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

  if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminMobileNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
