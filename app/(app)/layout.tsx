import { Group } from "@mantine/core";
import { BoardNav } from "./board-nav";
import { UserMenu } from "./user-menu";

const BACKGROUND_IMAGE = "/compass-parchment-background.png";

const PARCHMENT = "#e8dcc0";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          background: `${PARCHMENT} url('${BACKGROUND_IMAGE}') center / 100% no-repeat`,
        }}
      >
        <BoardNav />
        <Group
          gap={10}
          px={20}
          py={16}
          wrap="nowrap"
          style={{ marginTop: "auto", borderTop: "0.5px solid rgba(92,67,38,0.3)" }}
        >
          <UserMenu />
        </Group>
      </div>
      <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
    </div>
  );
}
