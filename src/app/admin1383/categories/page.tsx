import { getCategories } from "@/lib/repositories";
import { CategoriesAdminClient } from "@/features/admin/CategoriesAdminClient";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return <CategoriesAdminClient initialCategories={categories} />;
}
