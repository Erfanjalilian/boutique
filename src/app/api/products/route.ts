import { getProducts, getCategories } from "@/lib/repositories";
import { apiSuccess } from "@/utils/api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const category = searchParams.get("category") || "";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;
  const featured = searchParams.get("featured");
  const bestSeller = searchParams.get("bestSeller");
  const newArrival = searchParams.get("newArrival");

  let products = await getProducts();

  if (search) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
    );
  }

  if (category) {
    products = products.filter((p) => p.categoryId === category);
  }

  if (featured === "true") {
    products = products.filter((p) => p.featured);
  }

  if (bestSeller === "true") {
    products = products.filter((p) => p.bestSeller);
  }

  if (newArrival === "true") {
    products = products.filter((p) => p.newArrival);
  }

  products = products.filter(
    (p) => p.price >= minPrice && p.price <= maxPrice
  );

  switch (sort) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "name":
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      products.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  const total = products.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = products.slice(offset, offset + limit);

  const categories = await getCategories();

  return apiSuccess({
    products: paginated,
    categories,
    pagination: { page, limit, total, totalPages },
  });
}
