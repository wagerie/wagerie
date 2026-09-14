import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Inter } from "next/font/google";
import QueryProvider from "@/lib/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { RouteTransition } from "@/components/layout/route-transition";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wagerie",
  description: "Be the next lucky winner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <RouteTransition>{children}</RouteTransition>
            <Toaster richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
