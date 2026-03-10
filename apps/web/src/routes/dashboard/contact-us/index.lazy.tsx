import { createLazyFileRoute } from "@tanstack/react-router";

import ContactUs from "@/features/dashboard/contact-us";
import { fetchContacts } from "@/features/dashboard/contact-us/lib/contact-api";
import { contactKeys } from "@/features/dashboard/contact-us/lib/contact-query";
import {
  contactListParamsSchema,
  normalizeContactListParams,
  type ContactListParams,
} from "@/features/dashboard/contact-us/lib/contact-schema";
import { prefetchResource } from "@/lib/prefetch";

export const Route = createLazyFileRoute("/dashboard/contact-us/")({
  validateSearch: (search: Record<string, unknown>) => {
    const parseOptionalBoolean = (value: unknown) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "string") {
        if (value === "true") return true;
        if (value === "false") return false;
      }
      return undefined;
    };

    const parseOptionalNumber = (value: unknown) => {
      if (typeof value === "number") return value;
      if (typeof value === "string" && value.length > 0) return Number(value);
      return undefined;
    };

    return contactListParamsSchema.partial().parse({
      page: parseOptionalNumber(search.page),
      limit: parseOptionalNumber(search.limit),
      search: typeof search.search === "string" ? search.search : undefined,
      isHandled: parseOptionalBoolean(search.isHandled),
      serviceId: parseOptionalNumber(search.serviceId),
    });
  },
  loader: async ({ context, search }) => {
    const params = normalizeContactListParams(
      (search as Partial<ContactListParams>) ?? {},
    );
    await prefetchResource(context.queryClient, contactKeys.list(params), () =>
      fetchContacts(params),
    );
    return null;
  },
  component: ContactUs,
});
