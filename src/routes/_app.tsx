import { createFileRoute, Outlet } from "@tanstack/react-router";
import { WireframeShell } from "@/components/wireframe/shell";

export const Route = createFileRoute("/_app")({
  component: () => (
    <WireframeShell>
      <Outlet />
    </WireframeShell>
  ),
});
