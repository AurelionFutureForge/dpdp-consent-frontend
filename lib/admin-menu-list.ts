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
          href: "#",
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
          href: "#",
          label: "Data Fiduciaries",
          icon: Users
        },
        {
          href: "#",
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
          href: "#",
          label: "Retention Policies",
          icon: Timer
        }
      ]
    },
    {
      groupLabel: "Operations",
      menus: [
        {
          href: "#",
          label: "Scheduler",
          icon: Calendar
        },
        {
          href: "#",
          label: "Notifications",
          icon: Bell
        }
      ]
    },
    {
      groupLabel: "Compliance",
      menus: [
        {
          href: "#",
          label: "Grievances",
          icon: SquarePen
        },
        {
          href: "#",
          label: "Audit Logs",
          icon: FileCheck
        }
      ]
    },
    {
      groupLabel: "System",
      menus: [
        {
          href: "#",
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
