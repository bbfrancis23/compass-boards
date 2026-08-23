import { redirect } from "next/navigation";
import { Button, Center, Paper, Stack, Text, Title } from "@mantine/core";
import { auth, signIn } from "@/auth";

export default async function SignInPage() {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return (
    <Center style={{ minHeight: "100vh" }}>
      <Paper withBorder radius="md" p="xl" w={360}>
        <Stack gap="md" align="center">
          <Title order={3}>Compass Boards</Title>
          <Text size="sm" c="dimmed" ta="center">
            Sign in to view your boards.
          </Text>
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/" });
            }}
            style={{ width: "100%" }}
          >
            <Button type="submit" fullWidth>
              Sign in with GitHub
            </Button>
          </form>
        </Stack>
      </Paper>
    </Center>
  );
}
