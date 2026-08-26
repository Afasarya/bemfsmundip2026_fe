import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Bara Command — Admin BEM FSM UNDIP",
  description: "Panel pengelolaan konten Kabinet Bara Momentum.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
