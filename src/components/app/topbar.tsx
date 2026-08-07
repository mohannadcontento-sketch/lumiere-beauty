"use client";

import { useApp, useCurrentUser } from "@/lib/store";
import { Avatar } from "@/components/shared/ui";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Menu, Search, User, Settings, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const ROLE_LABELS: Record<string, string> = {
  owner: "المالك",
  reception: "موظف الاستقبال",
  staff: "أخصائي",
  customer: "عميل",
};

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const user = useCurrentUser();
  const logout = useApp((s) => s.logout);
  const setView = useApp((s) => s.setView);
  const notifications = useApp((s) => s.notifications);
  const resetData = useApp((s) => s.resetData);
  const unread = notifications.filter((n) => !n.read).length;

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden"
        aria-label="القائمة"
      >
        <Menu className="size-5" />
      </button>

      {/* Search */}
      <div className="relative hidden flex-1 max-w-md sm:block">
        <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="بحث عن عميل، موعد، فاتورة..."
          className="h-9 w-full rounded-md border border-border bg-card pr-9 pl-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
        />
      </div>

      <div className="flex-1 sm:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <button
          onClick={() => setView("notifications")}
          className="relative rounded-md p-2 text-muted-foreground hover:bg-accent"
          aria-label="التنبيهات"
        >
          <Bell className="size-5" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>

        {/* Reset demo data */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:inline-flex"
          onClick={() => {
            resetData();
            toast.success("تمت إعادة تعيين البيانات التجريبية");
          }}
          title="إعادة تعيين البيانات التجريبية"
        >
          <RefreshCw className="size-4" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md p-1 pl-2 hover:bg-accent">
              <Avatar name={user.name} color={user.avatarColor} size="sm" />
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold leading-tight text-foreground">{user.name}</div>
                <div className="text-[11px] leading-tight text-muted-foreground">{ROLE_LABELS[user.role]}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              الحساب
            </DropdownMenuLabel>
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="size-4" />
              <span>{user.name}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 text-muted-foreground" dir="ltr">
              <span className="truncate">{user.email}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => {
                resetData();
                toast.success("تمت إعادة تعيين البيانات");
              }}
            >
              <RefreshCw className="size-4" />
              إعادة تعيين البيانات التجريبية
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => {
                if (user.role === "owner") setView("settings");
              }}
              disabled={user.role !== "owner"}
            >
              <Settings className="size-4" />
              الإعدادات
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 text-destructive focus:text-destructive"
              onClick={() => {
                logout();
                toast("تم تسجيل الخروج");
              }}
            >
              <LogOut className="size-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
