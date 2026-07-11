import { getContact } from "@/lib/repositories";
import { ContactAdminClient } from "@/features/admin/ContactAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const contact = await getContact();
  return <ContactAdminClient initialContact={contact} />;
}
