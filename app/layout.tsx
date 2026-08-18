import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "./globals.css";
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
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
