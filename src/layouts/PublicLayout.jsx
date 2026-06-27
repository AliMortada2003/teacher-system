import { Outlet } from "react-router-dom";
import { PublicHeader } from "../components/layout/PublicHeader";
import { PublicFooter } from "../components/layout/PublicFooter";

export function PublicLayout() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#F4FAFF] text-[#0B2B3F]">
      <PublicHeader />

      <main>
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}