import Link from "next/link";
import { Avatar, Button, Group, Stack, Text } from "@mantine/core";
import { auth, signOut } from "@/auth";

export async function UserMenu() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Link href="/signin" style={{ textDecoration: "none" }}>
        <Button size="xs" variant="light" fullWidth component="span">
          Sign in
        </Button>
      </Link>
    );
  }

  const { name, email, image } = session.user;

  return (
    <Stack gap="xs" >
      <Group gap="xs" wrap="nowrap">
        {image && <Avatar src={image} size="sm" radius="xl" alt="" />}
        <Text size="sm" truncate>
          {name ?? email}
        </Text>
      </Group>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <Button type="submit" size="xs" variant="subtle" fullWidth>
          Sign out
        </Button>
      </form>
    </Stack>
  );
}
