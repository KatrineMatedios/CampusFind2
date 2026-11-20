import { Outlet } from "react-router-dom";
import AppBar from "./AppBar";
import BottomNav from "./BottomNav";
import DesktopHeader from "./DesktopHeader";
import DesktopSidebar from "./DesktopSidebar";

export default function AppLayout() {
  return (
    <div className="min-h-dvh bg-brand-cream lg:bg-[#f1e9d8] lg:pl-72">
      <DesktopSidebar />

      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-brand-cream shadow-xl shadow-stone-300/40 lg:mx-0 lg:max-w-none lg:shadow-none">
        <div className="lg:hidden">
          <AppBar />
        </div>

        <DesktopHeader />

        <main className="flex-1 px-4 pb-24 pt-4 lg:px-8 lg:pb-10 lg:pt-6">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
