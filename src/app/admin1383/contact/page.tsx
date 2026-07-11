import { getContact } from "@/lib/repositories";
import { ContactAdminClient } from "@/features/admin/ContactAdminClient";

export default async function AdminContactPage() {
  const contact = await getContact();
  return <ContactAdminClient initialContact={contact} />;
}
