import { getUsers } from "@/lib/repositories";
import { UsersAdminClient } from "@/features/admin/UsersAdminClient";

export default async function AdminUsersPage() {
  const users = await getUsers();
  return <UsersAdminClient initialUsers={users} />;
}
