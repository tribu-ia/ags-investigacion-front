import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import "./globals.css";
import "./fonts/background.css";

export const metadata: Metadata = {
  title: "Tribu IA",
  description: "Plataforma de investigación de agentes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col magicpattern">
            <main className="flex-1 container mx-auto px-4">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
