import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, BookOpenText, CalendarCheck } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-slate-100 ml-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
      </div>
      <div className="flex gap-3">
        <button className="relative cursor-pointer mr-3 sm:mr-5">
          <Bell size={18} />
          <span className="absolute flex size-2 top-1 right-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-sky-500"></span>
          </span>
        </button>
        <Button variant='outline'> <CalendarCheck /> <span className="hidden sm:inline-block">Schedule</span> </Button>
        <Button> <BookOpenText /> Book Training</Button>
      </div>
    </header>
  )
}
