import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(website)/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <nav>Navbar</nav>
      <Outlet />
      <footer>footer bar</footer>
    </div>
  );
}
