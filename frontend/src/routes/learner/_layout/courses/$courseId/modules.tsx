import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/learner/_layout/courses/$courseId/modules',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/learner/_layout/courses/$courseId/modules"!</div>
}
