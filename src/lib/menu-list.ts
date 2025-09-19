import {
  Users,
  LayoutGrid,
  LucideIcon,
  CopyCheck,
  Users2,
  UserCheck,
  Ticket,
  Bell,
  Settings,
  User,
  Shield
} from "lucide-react";

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
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        },{
          href: "/consent",
          label: "Consent",
          icon: UserCheck,
          submenus: []
        },
        {
          href: "/requests",
          label: "Requests",
          icon: Ticket,
          submenus: []
        },{
          href: "/notifications",
          label: "Notifications",
          icon: Bell,
          submenus: []
        },
        {
          href: "/profile",
          label: "Profile",
          icon: User,
          submenus: []
        },
        {
          href: "Admin",
          label: "Admin",
          icon: Shield,
          submenus: []
        }
      ]
    },
    // {
    //   groupLabel: "Contents",
    //   menus: [
    //     {
    //       href: "",
    //       label: "Posts",
    //       icon: SquarePen,
    //       submenus: [
    //         {
    //           href: "/posts",
    //           label: "All Posts"
    //         },
    //         {
    //           href: "/posts/new",
    //           label: "New Post"
    //         }
    //       ]
    //     },
    //     {
    //       href: "/categories",
    //       label: "Categories",
    //       icon: Bookmark
    //     },
    //     {
    //       href: "/tags",
    //       label: "Tags",
    //       icon: Tag
    //     }
    //   ]
    // },

  ];
}
