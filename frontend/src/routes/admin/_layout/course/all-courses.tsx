import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_layout/course/all-courses')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/_layout/course/all-courses"!</div>
}
