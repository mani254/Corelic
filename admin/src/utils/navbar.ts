import {
  BarChart2,
  CreditCard,
  DollarSign,
  FileText,
  History,
  Layers,
  LayoutDashboard,
  ListChecks,
  Package,
  Server,
  Settings,
  Shield,
  ShoppingCart,
  SlidersHorizontal,
  Store,
  Tag,
  Truck,
  Users,
} from "lucide-react";
import { ElementType } from "react";

// Types
export interface ItemType {
  label: string;
  route: string;
  icon?: ElementType;
  children?: ItemType[];
}

// Navigation Items for E-Commerce Backend
const navItems: ItemType[] = [
  {
    label: "Dashboard",
    route: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Catalog",
    route: "/catalog",
    icon: Package,
    children: [
      { label: "Products", route: "/catalog/products", icon: ShoppingCart },
      { label: "Categories", route: "/catalog/categories", icon: Layers },
      { label: "Collections", route: "/catalog/collections", icon: Tag },
      { label: "Attributes", route: "/catalog/attributes", icon: ListChecks },
      { label: "Brands", route: "/catalog/brands", icon: Store },
    ],
  },
  {
    label: "Orders",
    route: "/orders",
    icon: ShoppingCart,
    children: [
      { label: "All Orders", route: "/orders/all", icon: FileText },
      { label: "Returns", route: "/orders/returns", icon: History },
      { label: "Refunds", route: "/orders/refunds", icon: CreditCard },
      { label: "Abandoned Carts", route: "/orders/abandoned-carts", icon: ShoppingCart },
    ],
  },
  {
    label: "Customers",
    route: "/customers",
    icon: Users,
    children: [
      { label: "Customer List", route: "/customers/list", icon: Users },
      { label: "Groups", route: "/customers/groups", icon: Layers },
      { label: "Reviews", route: "/customers/reviews", icon: FileText },
      { label: "Customer Segments", route: "/customers/segments", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Shipping",
    route: "/shipping",
    icon: Truck,
    children: [
      { label: "Shipping Methods", route: "/shipping/methods", icon: Truck },
      { label: "Shipping Zones", route: "/shipping/zones", icon: Package },
      { label: "Carriers", route: "/shipping/carriers", icon: Truck },
    ],
  },
  {
    label: "Payments",
    route: "/payments",
    icon: DollarSign,
    children: [
      { label: "Payment Methods", route: "/payments/methods", icon: CreditCard },
      { label: "Transactions", route: "/payments/transactions", icon: DollarSign },
    ],
  },
  {
    label: "Reports",
    route: "/reports",
    icon: BarChart2,
    children: [
      { label: "Sales Reports", route: "/reports/sales", icon: BarChart2 },
      { label: "Customer Reports", route: "/reports/customers", icon: BarChart2 },
      { label: "Product Reports", route: "/reports/products", icon: BarChart2 },
    ],
  },
  {
    label: "Settings",
    route: "/settings",
    icon: Settings,
    children: [
      { label: "Store Settings", route: "/settings/store", icon: Store },
      { label: "Checkout Settings", route: "/settings/checkout", icon: ShoppingCart },
      { label: "Tax Settings", route: "/settings/tax", icon: DollarSign },
      { label: "Shipping Settings", route: "/settings/shipping", icon: Truck },
      { label: "Notification Settings", route: "/settings/notifications", icon: Server },
    ],
  },
  {
    label: "Administration",
    route: "/admin",
    icon: Shield,
    children: [
      { label: "User Management", route: "/admin/users", icon: Users },
      { label: "Roles & Permissions", route: "/admin/roles", icon: Shield },
      { label: "API Keys", route: "/admin/api-keys", icon: Server },
      { label: "Activity Logs", route: "/admin/logs", icon: History },
    ],
  },
];

export default navItems;
