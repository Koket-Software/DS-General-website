import { ContactUsForm } from "../ContactUsForm";
import { useContactByIdQuery } from "../lib/contact-query";

interface ContactEditProps {
  contactId: number;
}

export default function ContactEdit({ contactId }: ContactEditProps) {
  const { data, isPending, isError, error } = useContactByIdQuery(contactId);

  if (isPending) return <div className="p-8">Loading contact…</div>;
  if (isError || !data?.data)
    return (
      <div className="p-8 text-destructive">
        Failed to load contact{error ? `: ${error.message}` : ""}
      </div>
    );

  return <ContactUsForm mode="edit" contactUs={data.data} />;
}
