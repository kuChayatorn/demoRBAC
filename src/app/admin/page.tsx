"use client";
import { title } from "@/components/primitives";
import { useAuth } from "@/src/provider/Auth.provider";
import { useCan } from "@/src/provider/Can.provider";

export default function AboutPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { can } = useCan();

  if (isLoading) return <p>Loading...</p>;

  if (!isAuthenticated || !user) {
    return <p className="text-red-500">You are not logged in.</p>;
  }

  const canManageUsers = can(user.role, "manage", "users");
  const canViewDashboard = can(user.role, "view", "dashboard");
  const canEditQuestions = can(user.role, "edit", "questions");
  return (
    <div>
      <h1 className={title()}>Admin Page</h1>
      <p className="mt-4">Welcome, {user.username}</p>

      {canManageUsers ? (
        <p className="text-green-600 mt-2">✅ You can manage users.</p>
      ) : (
        <p className="text-red-600 mt-2">❌ You do not have permission to manage users.</p>
      )}
      {
        canEditQuestions?(
          <p className="text-green-600 mt-2">✅ You can edit questions.</p>
        ):(
          <p className="text-red-600 mt-2">❌ You do not have permission to edit questions.</p>
        )
      }
      {
        canViewDashboard?(
          <p className="text-green-600 mt-2">✅ You can view dashboard.</p>
        ):(
          <p className="text-red-600 mt-2">❌ You do not have permission to view dashboard.</p>
        )
      }

    </div>
  );
}
