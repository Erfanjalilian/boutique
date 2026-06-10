import categoriesData from "../../../data/categories.json";

export async function getCategories() {
  // Simulate database delay (optional)
  // await new Promise((resolve) => setTimeout(resolve, 100));
  return categoriesData;
}

export async function getCategoryById(id: string) {
  const categories = await getCategories();
  return categories.find((category) => category.id === id);
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug);
}