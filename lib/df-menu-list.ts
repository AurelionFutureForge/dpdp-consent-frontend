import { Tag, Users, Settings, SquarePen, LayoutGrid, LucideIcon, Webhook, ShieldCheck, FileCheck, CheckSquare, Timer } from "lucide-react";

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
          href: "/df/dashboard",
          label: "Overview",
          icon: LayoutGrid,
          submenus: []
        },
        {
          href: "/df/profile",
          label: "Profile",
          icon: Users
        }
      ]
    },
    {
      groupLabel: "Consent & Purposes",
      menus: [
        {
          href: "/df/purposes",
          label: "Purposes",
          icon: Tag
        },
        {
          href: "/df/consents",
          label: "Consents",
          icon: CheckSquare
        }
      ]
    },
    {
      groupLabel: "Integrations",
      menus: [
        {
          href: "/df/webhooks",
          label: "Webhooks",
          icon: Webhook
        },
        {
          href: "/df/validation",
          label: "Validation",
          icon: ShieldCheck
        }
      ]
    },
    {
      groupLabel: "Compliance",
      menus: [
        {
          href: "/df/grievances",
          label: "Grievances",
          icon: SquarePen
        },
        {
          href: "/df/audit-logs",
          label: "Audit Logs",
          icon: FileCheck
        }
      ]
    },
    {
      groupLabel: "Data Management",
      menus: [
        {
          href: "/df/retention",
          label: "Retention & Expiry",
          icon: Timer
        }
      ]
    },
    {
      groupLabel: "System",
      menus: [
        {
          href: "/df/settings",
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
