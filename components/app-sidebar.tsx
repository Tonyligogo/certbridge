"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon, BookCopy, CalendarDays, Wallet } from "lucide-react"
import { User } from "@/lib/auth"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Courses",
      url: "#",
      icon: (
        <BookCopy />
      ),
    },
    {
      title: "Calendar",
      url: "#",
      icon: (
        <CalendarDays />
      ),
    },
    {
      title: "Payments",
      url: "#",
      icon: (
        <Wallet />
      ),
    },
    {
      title: "Team",
      url: "#",
      icon: (
        <UsersIcon
        />
      ),
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
    },
    {
      title: "Get Help",
      url: "#",
      icon: (
        <CircleHelpIcon
        />
      ),
    }
  ],
  documents: [
    {
      name: "Certificates",
      url: "#",
      icon: (
        <FileIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: User }) {
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
            {/* Logo */}
               <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-8 h-8 flex items-center justify-center bg-slate-950 rounded-full text-white font-black overflow-hidden tracking-tighter">
              <span className="text-xs z-10">C</span>
              <span className="text-xs z-10 -ml-0.5 text-blue-400">B</span>
              <div className="absolute inset-0 bg-linear-to-tr from-slate-900 via-transparent to-slate-800 opacity-50" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              CertBridge<span className="text-slate-500 font-medium text-lg ml-1">Global</span>
            </span>
          </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
