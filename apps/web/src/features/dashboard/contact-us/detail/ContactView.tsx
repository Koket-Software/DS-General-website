import { ContactUsForm } from "../ContactUsForm";
import { useContactByIdQuery } from "../lib/contact-query";

interface ContactViewProps {
  contactId: number;
}

export default function ContactView({ contactId }: ContactViewProps) {
  const { data, isPending, isError, error } = useContactByIdQuery(contactId);

  if (isPending) return <div className="p-8">Loading contact…</div>;

  if (isError || !data?.data) {
    return (
      <div className="p-8 text-destructive">
        Failed to load contact{error ? `: ${error.message}` : ""}
      </div>
    );
  }

  return <ContactUsForm mode="view" contactUs={data.data} />;
}
