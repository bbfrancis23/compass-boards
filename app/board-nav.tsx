"use client";

import Link from "next/link";
import { NavLink, Stack, Text } from "@mantine/core";
import { listBoardConfigs } from "@/boards";

export function BoardNav() {
  const boards = listBoardConfigs();

  return (
    <Stack gap="xs" p="md" w={220} style={{ flexShrink: 0 }}>
      <Text size="xs" fw={700} tt="uppercase" c="dimmed">
        Boards
      </Text>
      {boards.map((board) => (
        <NavLink
          key={board.id}
          component={Link}
          href={`/boards/${board.id}`}
          label={board.label}
        />
      ))}
    </Stack>
  );
}
