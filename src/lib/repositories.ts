import { readJson, writeJson, readJsonObject } from "@/lib/storage";
import type {
  User,
  Product,
  Order,
  Category,
  Size,
  Color,
  OtpRecord,
  ContactInfo,
  AboutInfo,
  SiteSettings,
  OrderStatus,
} from "@/types";

export async function getUsers(): Promise<User[]> {
  return readJson<User[]>("users.json");
}

export async function saveUsers(users: User[]): Promise<void> {
  await writeJson("users.json", users);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.id === id);
}

export async function getUserByPhone(phone: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.phone === phone);
}

export async function getProducts(): Promise<Product[]> {
  return readJson<Product[]>("products.json");
}

export async function saveProducts(products: Product[]): Promise<void> {
  await writeJson("products.json", products);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function getOrders(): Promise<Order[]> {
  return readJson<Order[]>("orders.json");
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await writeJson("orders.json", orders);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id);
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const orders = await getOrders();
  return orders.filter((o) => o.userId === userId);
}

export async function getCategories(): Promise<Category[]> {
  return readJson<Category[]>("categories.json");
}

export async function saveCategories(categories: Category[]): Promise<void> {
  await writeJson("categories.json", categories);
}

export async function getSizes(): Promise<Size[]> {
  return readJson<Size[]>("sizes.json");
}

export async function saveSizes(sizes: Size[]): Promise<void> {
  await writeJson("sizes.json", sizes);
}

export async function getColors(): Promise<Color[]> {
  return readJson<Color[]>("colors.json");
}

export async function saveColors(colors: Color[]): Promise<void> {
  await writeJson("colors.json", colors);
}

export async function getOtps(): Promise<OtpRecord[]> {
  return readJson<OtpRecord[]>("otps.json");
}

export async function saveOtps(otps: OtpRecord[]): Promise<void> {
  await writeJson("otps.json", otps);
}

export async function getSettings(): Promise<SiteSettings> {
  return readJsonObject<SiteSettings>("settings.json", {
    websiteName: "بوتیک",
    metaTitle: "بوتیک - فروشگاه پوشاک",
    metaDescription: "",
    favicon: "/Image/logo.svg",
    logo: "/Image/logo.svg",
    footerText: "",
    footerLinks: [],
  });
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await writeJson("settings.json", settings);
}

export async function getAbout(): Promise<AboutInfo> {
  return readJsonObject<AboutInfo>("about.json", {
    description: "",
    story: "",
    mission: "",
    vision: "",
    additionalContent: "",
  });
}

export async function saveAbout(about: AboutInfo): Promise<void> {
  await writeJson("about.json", about);
}

export async function getContact(): Promise<ContactInfo> {
  return readJsonObject<ContactInfo>("contact.json", {
    phone: "",
    email: "",
    address: "",
    socialMedia: {},
  });
}

export async function saveContact(contact: ContactInfo): Promise<void> {
  await writeJson("contact.json", contact);
}

export async function getDashboardStats() {
  const [products, orders, users] = await Promise.all([
    getProducts(),
    getOrders(),
    getUsers(),
  ]);

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalUsers: users.filter((u) => u.role === "user").length,
    recentOrders,
  };
}

export type { OrderStatus };
