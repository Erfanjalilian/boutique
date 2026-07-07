export type UserRole = "user" | "admin";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface User {
  id: string;
  phone: string;
  name: string;
  address: string;
  postalCode: string;
  role: UserRole;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Size {
  id: string;
  name: string;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  sizes: string[];      // Keep if used elsewhere (e.g., admin panel)
  colors: string[];     // Keep if used elsewhere (e.g., admin panel)
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  stock: number;
  createdAt: string;
}

// Updated: Removed size and color
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Updated: Removed size and color
// Updated OrderItem - no size or color
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  fullName: string;
  phone: string;
  address: string;
  postalCode: string;
  notes: string;
  createdAt: string;
}

export interface OtpRecord {
  phone: string;
  code: string;
  expiresAt: string;
  // ISO timestamp when code was last sent
  sentAt?: string;
  // number of verification attempts made
  attempts?: number;
  // number of times code was resent in a rolling window
  resendCount?: number;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  socialMedia: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    telegram?: string;
  };
}

export interface AboutInfo {
  description: string;
  story: string;
  mission: string;
  vision: string;
  additionalContent: string;
}

export interface SiteSettings {
  websiteName: string;
  metaTitle: string;
  metaDescription: string;
  favicon: string;
  logo: string;
  footerText: string;
  footerLinks: { label: string; href: string }[];
}

export interface SessionPayload {
  userId: string;
  role: UserRole;
  phone: string;
}