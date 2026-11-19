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
  BriefcaseBusiness,
  BarChart3,
  Building2,
} from "lucide-react";

import { User } from "@/lib/auth";
import { useParams } from "next/navigation";
import Image from "next/image";

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
      url: "/admin",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Courses",
      url: "/admin/courses",
      icon: <GraduationCap />,
    },
    {
      title: "Bookings",
      url: "/admin/bookings",
      icon: <ClipboardList />,
    },
    {
      title: "Enquiries",
      url: "/admin/enquiries",
      icon: <ClipboardList />,
    },
    {
      title: "Trainers",
      url: "/admin/trainers",
      icon: <BriefcaseBusiness />,
    },
    {
      title: "Venues",
      url: "/admin/venues",
      icon: <Building2 />,
    },
    {
      title: "Clients",
      url: "/admin/clients",
      icon: <UsersIcon />,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: <BarChart3 />,
    },
  ],

  documents: [
    {
      name: "Documents",
      url: "/admin/documents",
      icon: <FileIcon />,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: <Settings2Icon />,
    },
    {
      title: "Help Requests",
      url: "/admin/help-requests",
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
              <Image
                          src="/Logo.png"
                          alt="CertBridge Global Logo"
                          width={500}
                          height={130}
                          className="h-auto w-full max-w-60 object-contain"
                        />
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
