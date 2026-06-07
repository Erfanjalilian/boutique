"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { formatDate } from "@/utils/helpers";
import type { User, UserRole } from "@/types";

export function UsersAdminClient({
  initialUsers,
}: {
  initialUsers: User[];
}) {
  const [users, setUsers] = useState(initialUsers);

  async function updateRole(id: string, role: UserRole) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (data.success) {
      setUsers(users.map((u) => (u.id === id ? data.data : u)));
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">مدیریت کاربران</h1>
      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">{user.name || "کاربر بدون نام"}</p>
                <p className="text-sm text-muted">{user.phone}</p>
                <p className="text-xs text-muted mt-1">
                  عضویت: {formatDate(user.createdAt)}
                </p>
              </div>
              <div className="w-32">
                <Select
                  value={user.role}
                  onChange={(e) => updateRole(user.id, e.target.value as UserRole)}
                  options={[
                    { value: "user", label: "کاربر" },
                    { value: "admin", label: "مدیر" },
                  ]}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
