import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "./globals.css";
import { BoardNav } from "./board-nav";
import { RegisterWidgets } from "./register-widgets";
import { UserMenu } from "./user-menu";
import { theme } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Compass Boards",
  description: "Dashboards for tracking what matters, with AI-generated advice.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      {...mantineHtmlProps}
    >
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <RegisterWidgets />
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
              <BoardNav />
              <div style={{ marginTop: "auto", padding: "var(--mantine-spacing-md)" }}>
                <UserMenu />
              </div>
            </div>
            <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
