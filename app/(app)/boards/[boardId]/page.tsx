import { notFound } from "next/navigation";
import { getBoardConfig } from "@/boards";
import { DashboardCanvas } from "@/lib/dashboard-canvas";
import { getBoardWidgets } from "@/lib/widget-actions";

export default async function BoardPage({ params }: PageProps<"/boards/[boardId]">) {
  const { boardId } = await params;
  const config = getBoardConfig(boardId);
  if (!config) notFound();

  const widgets = await getBoardWidgets(boardId);

  return (
    <div style={{ padding: 24 }}>
      <h1>{config.label}</h1>
      <DashboardCanvas boardId={boardId} widgets={widgets} />
    </div>
  );
}
