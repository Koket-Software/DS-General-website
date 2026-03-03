import { createLazyFileRoute } from "@tanstack/react-router";

import { Booking } from "@/features/booking";

export const Route = createLazyFileRoute("/_site/schedule")({
  component: SchedulePage,
});

function SchedulePage() {
  return <Booking />;
}
