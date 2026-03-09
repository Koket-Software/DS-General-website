import { createLazyFileRoute } from "@tanstack/react-router";

import { ContactUsForm } from "@/features/dashboard/contact-us/ContactUsForm";

export const Route = createLazyFileRoute("/dashboard/contact-us/create")({
  component: () => <ContactUsForm mode="create" />,
});
