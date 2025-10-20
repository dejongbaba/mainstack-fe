import { createFileRoute } from '@tanstack/react-router'
import { SheetAnimationTest } from '@/components/sheet-animation-test'

export const Route = createFileRoute('/animation-test')({
  component: () => <SheetAnimationTest />,
})