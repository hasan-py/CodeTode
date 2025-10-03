import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(website)/_layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(website)/_layout/"!</div>
}
