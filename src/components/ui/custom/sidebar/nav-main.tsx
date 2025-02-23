"use client"

import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { SidebarItem } from "./app-sidebar"
import { usePathname } from "next/navigation"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export function NavMain({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname()

  const isActive = (url: string) => pathname === url
  const isGroupActive = (items: { url: string }[]) =>
    items?.some(item => isActive(item.url))

  return (
    <SidebarGroup className="p-0">
      <VisuallyHidden asChild>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
      </VisuallyHidden>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive || isGroupActive(item.items || [])}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive(item.url)}
                className={isGroupActive(item.items || []) ?
                  "text-primary font-medium" : ""}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                  <p>{isGroupActive(item.items || [])}</p>
                </Link>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(subItem.url)}
                            className={isActive(subItem.url) ?
                              "px-3 bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary" : ""}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
