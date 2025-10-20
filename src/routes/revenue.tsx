import { createFileRoute } from '@tanstack/react-router';
import Dashboard from '@/components/dashboard';

export const Route = createFileRoute('/revenue')({
  component: Dashboard,
});
