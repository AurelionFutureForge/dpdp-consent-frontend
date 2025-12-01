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
          href: "#",
          label: "Overview",
          icon: LayoutGrid,
          submenus: []
        },
        {
          href: "#",
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
          href: "#",
          label: "Consents",
          icon: CheckSquare
        }
      ]
    },
    {
      groupLabel: "Integrations",
      menus: [
        {
          href: "#",
          label: "Webhooks",
          icon: Webhook
        },
        {
          href: "#",
          label: "Validation",
          icon: ShieldCheck
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
      groupLabel: "Data Management",
      menus: [
        {
          href: "#",
          label: "Retention & Expiry",
          icon: Timer
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
