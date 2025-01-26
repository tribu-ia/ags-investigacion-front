"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  LifeBuoy,
  Send,
} from "lucide-react"

import { NavMain } from "@/components/ui/custom/sidebar/nav-main"
import { NavSecondary } from "@/components/ui/custom/sidebar/nav-secondary"
import { NavUser } from "@/components/ui/custom/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Centro de investigacion",
      url: "##",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Agente investigador",
          url: "/dashboard/centro-investigacion/agente",
        },
        {
        title: "Guias y recursos",
         url: "/dashboard/centro-investigacion/guias",
         }
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Investigar nuevo agente",
          url: "/dashboard/documentation/nuevo-agente",
        },
        // {
        //   title: "Mis investigaciones",
        //   url: "/dashboard/documentation/mis-investigaciones",  
        // },
        {
          title: "Proximos eventos",
          url: "/dashboard/documentation/eventos",
        }
      ],
    }
  ],
  navSecondary: [
    // {
    //   title: "Support",
    //   url: "#",
    //   icon: LifeBuoy,
    // },
    // {
    //   title: "Feedback",
    //   url: "#",
    //   icon: Send,
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Tribu IA</span>
                  <span className="truncate text-xs">Investigación</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
