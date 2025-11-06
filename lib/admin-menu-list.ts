import { Tag, Users, Settings, SquarePen, LayoutGrid, LucideIcon, Bell, Calendar, FileCheck, Timer } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  const groups: Group[] = [
    {
      groupLabel: "",
      menus: [
        {
          href: "/sys-admin/dashboard",
          label: "Overview",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Directory",
      menus: [
        {
          href: "/sys-admin/data-fiduciaries",
          label: "Data Fiduciaries",
          icon: Users
        },
        {
          href: "/sys-admin/users",
          label: "Users & Roles",
          icon: Users
        }
      ]
    },
    {
      groupLabel: "Policy & Taxonomy",
      menus: [
        {
          href: "/sys-admin/purposes",
          label: "Purposes & Categories",
          icon: Tag
        },
        {
          href: "/sys-admin/retention",
          label: "Retention Policies",
          icon: Timer
        }
      ]
    },
    {
      groupLabel: "Operations",
      menus: [
        {
          href: "/sys-admin/scheduler",
          label: "Scheduler",
          icon: Calendar
        },
        {
          href: "/sys-admin/notifications",
          label: "Notifications",
          icon: Bell
        }
      ]
    },
    {
      groupLabel: "Compliance",
      menus: [
        {
          href: "/sys-admin/grievances",
          label: "Grievances",
          icon: SquarePen
        },
        {
          href: "/sys-admin/audit-logs",
          label: "Audit Logs",
          icon: FileCheck
        }
      ]
    },
    {
      groupLabel: "System",
      menus: [
        {
          href: "/sys-admin/settings",
          label: "Settings",
          icon: Settings
        }
      ]
    }
  ];

  // mark active items based on current pathname
  return groups.map((group) => ({
    ...group,
    menus: group.menus.map((menu) => ({
      ...menu,
      active: pathname.startsWith(menu.href)
    }))
  }));
}
