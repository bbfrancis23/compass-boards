import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "./globals.css";
import { RegisterWidgets } from "./register-widgets";
import { SuppressColorSchemeScriptWarning } from "./suppress-color-scheme-script-warning";
import { theme } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Compass Boards",
  description: "Dashboards for tracking what matters, with AI-generated advice.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <SuppressColorSchemeScriptWarning />
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <RegisterWidgets />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
