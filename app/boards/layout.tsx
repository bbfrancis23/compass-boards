import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function BoardsLayout({ children }: LayoutProps<"/boards">) {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return children;
}
