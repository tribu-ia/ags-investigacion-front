"use client";

import { AppSidebar } from "@/components/ui/custom/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import Link from "next/link";

import AgentChat from "@/components/ui/custom/agent-chat/agent-chat";
import { CopilotKit } from "@copilotkit/react-core";

import "@copilotkit/react-ui/styles.css";
import { ResearchProvider } from "@/contexts/investigation-context";
const viewsWithAgentChat = ["/dashboard/centro-investigacion/agen"];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = useBreadcrumbs();

  return (
      <SidebarProvider>
         <CopilotKit
                    publicApiKey={process.env.NEXT_PUBLIC_COPILOT_CLOUD_API_KEY} // if using copilot cloud
                    runtimeUrl={process.env.NEXT_PUBLIC_COPILOT_CLOUD_API_KEY ?
                        // copilot cloud
                        "https://api.cloud.copilotkit.ai/copilotkit/v1" :
                        // local
                        "/api/copilotkit"}
                    showDevConsole={true}
                    agent="agent"
                    
                >
        <ResearchProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <BreadcrumbItem key={breadcrumb.href}>
                      {index > 0 && <BreadcrumbSeparator />}
                      {breadcrumb.isCurrentPage ? (
                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                      ) : (
                        <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
        {viewsWithAgentChat.includes(breadcrumbs[breadcrumbs.length - 1].href) && (
          <AgentChat />
        )}
        </ResearchProvider>
        </CopilotKit>
      </SidebarProvider>
  );
}
