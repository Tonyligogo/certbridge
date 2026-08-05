import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getServerSession } from "@/lib/get-server-session"
import { redirect } from "next/navigation"

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession()
    const user = session?.user;
    if(!user){
        redirect('/')
    }
    if(user.role !== 'admin'){
        redirect('/')
    }
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 68)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" className="border-r border-slate-100" user={user} />
      <SidebarInset className='bg-white' >
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-2 md:gap-6 md:p-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default MainLayout