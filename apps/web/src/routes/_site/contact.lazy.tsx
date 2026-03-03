import { createLazyFileRoute } from "@tanstack/react-router";

import { Contact } from "@/features/contact";

export const Route = createLazyFileRoute("/_site/contact")({
  component: ContactPage,
});

function ContactPage() {
  return <Contact />;
}
