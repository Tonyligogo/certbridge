"use client";

import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  LayoutDashboardIcon,
  UsersIcon,
  Settings2Icon,
  CircleHelpIcon,
  FileIcon,
  BookCopy,
  CalendarDays,
  Wallet,
  GraduationCap,
  ClipboardList,
  UserCog,
  BriefcaseBusiness,
  BarChart3,
} from "lucide-react";

import { User } from "@/lib/auth";
import { useParams } from "next/navigation";

const portalSidebar = (clientId: string) => ({
  navMain: [
    {
      title: "Dashboard",
      url: `/portal/${clientId}`,
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Courses",
      url: `/portal/${clientId}/courses`,
      icon: <BookCopy />,
    },
    {
      title: "Calendar",
      url: `/portal/${clientId}/calendar`,
      icon: <CalendarDays />,
    },
    {
      title: "Payments",
      url: `/portal/${clientId}/payments`,
      icon: <Wallet />,
    },
    {
      title: "Team",
      url: `/portal/${clientId}/team`,
      icon: <UsersIcon />,
    },
  ],

  documents: [
    {
      name: "Certificates",
      url: `/portal/${clientId}/certificates`,
      icon: <FileIcon />,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: `/portal/${clientId}/settings`,
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: `/portal/${clientId}/help`,
      icon: <CircleHelpIcon />,
    },
  ],
});

const adminSidebar = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Courses",
      url: "#",
      icon: <GraduationCap />,
    },
    {
      title: "Bookings",
      url: "#",
      icon: <ClipboardList />,
    },
    {
      title: "Trainers",
      url: "#",
      icon: <BriefcaseBusiness />,
    },
    {
      title: "Clients",
      url: "#",
      icon: <UsersIcon />,
    },
    {
      title: "Admins",
      url: "#",
      icon: <UserCog />,
    },
    {
      title: "Reports",
      url: "#",
      icon: <BarChart3 />,
    },
  ],

  documents: [
    {
      name: "Documents",
      url: "#",
      icon: <FileIcon />,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <CircleHelpIcon />,
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: User;
}) {
  const {clientId} = useParams();
  const sidebar = user.role === 'admin' ? adminSidebar : portalSidebar(clientId as string);
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative w-8 h-8 flex items-center justify-center bg-slate-950 rounded-full text-white font-black overflow-hidden tracking-tighter">
                    <span className="text-xs z-10">C</span>
                    <span className="text-xs z-10 -ml-0.5 text-blue-400">
                      B
                    </span>
                    <div className="absolute inset-0 bg-linear-to-tr from-slate-900 via-transparent to-slate-800 opacity-50" />{" "}
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-slate-900">
                    CertBridge
                    <span className="text-slate-500 font-medium text-lg ml-1">
                      Global
                    </span>
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={sidebar.navMain} />
        <NavDocuments items={sidebar.documents} />
        <NavSecondary items={sidebar.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
