"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { DashboardView } from "@/components/views/dashboard-view";
import { CalendarView } from "@/components/views/calendar-view";
import { CustomersView } from "@/components/views/customers-view";
import { CustomerDetailView } from "@/components/views/customer-detail-view";
import { ServicesView } from "@/components/views/services-view";
import { StaffView } from "@/components/views/staff-view";
import { PosView } from "@/components/views/pos-view";
import { InventoryView } from "@/components/views/inventory-view";
import { LoyaltyView } from "@/components/views/loyalty-view";
import { MarketingView } from "@/components/views/marketing-view";
import { ReportsView } from "@/components/views/reports-view";
import { SettingsView } from "@/components/views/settings-view";
import { NotificationsView } from "@/components/views/notifications-view";
import { CustomerPortal } from "@/components/views/customer-portal";
import { StaffPortal } from "@/components/views/staff-portal";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function AppShell() {
  const view = useApp((s) => s.view);
  const [mobileOpen, setMobileOpen] = useState(false);

  // scroll to top on view change
  useEffect(() => {
    const el = document.getElementById("app-main");
    if (el) el.scrollTo({ top: 0 });
  }, [view]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-72 p-0">
          <Sidebar onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main id="app-main" className="thin-scroll flex-1 overflow-y-auto">
          <div key={view} className="animate-fade-slide mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8">
            {renderView(view)}
          </div>
        </main>
      </div>
    </div>
  );
}

function renderView(view: string) {
  switch (view) {
    case "dashboard":
      return <DashboardView />;
    case "calendar":
      return <CalendarView />;
    case "customers":
      return <CustomersView />;
    case "customer_detail":
      return <CustomerDetailView />;
    case "services":
      return <ServicesView />;
    case "staff":
      return <StaffView />;
    case "pos":
      return <PosView />;
    case "inventory":
      return <InventoryView />;
    case "loyalty":
      return <LoyaltyView />;
    case "marketing":
      return <MarketingView />;
    case "reports":
      return <ReportsView />;
    case "settings":
      return <SettingsView />;
    case "notifications":
      return <NotificationsView />;
    // Customer portal
    case "my_profile":
    case "book_appointment":
    case "my_appointments":
    case "my_offers":
      return <CustomerPortal />;
    // Staff portal
    case "staff_today":
    case "staff_customers":
    case "staff_schedule":
    case "staff_performance":
      return <StaffPortal />;
    default:
      return <DashboardView />;
  }
}
