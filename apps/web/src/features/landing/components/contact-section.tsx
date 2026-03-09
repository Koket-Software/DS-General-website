import { useState, type FormEvent } from "react";

import { YoutubeIcon, XIcon, InstagramIcon, LinkedinIcon } from "./icons";
import imgMap from "../../../../assets/1996b890973697a0ece35083743bf5f2cd592a73.webp";
import svgPaths from "../../../../imports/svg-b3plelej3t";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePublicContactMutation } from "@/lib/contacts/contacts-query";
import { createPublicContactSchema } from "@/lib/contacts/contacts-schema";
import { usePublicSocialsQuery } from "@/lib/socials/socials-query";

function PhoneIcon() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      className="shrink-0"
    >
      <path d={svgPaths.pcc49600} fill="var(--muted-foreground)" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      className="shrink-0"
    >
      <path d={svgPaths.p43bc400} fill="var(--muted-foreground)" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      className="shrink-0"
    >
      <path d={svgPaths.p2605d880} fill="var(--muted-foreground)" />
    </svg>
  );
}

function socialIcon(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes("youtube")) {
    return <YoutubeIcon />;
  }

  if (normalized.includes("instagram")) {
    return <InstagramIcon />;
  }

  if (normalized.includes("linkedin")) {
    return <LinkedinIcon />;
  }

  return <XIcon />;
}

type ContactFormValues = {
  fullName: string;
  emailOrPhone: string;
  message: string;
};

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [values, setValues] = useState<ContactFormValues>({
    fullName: "",
    emailOrPhone: "",
    message: "",
  });

  const socialsQuery = usePublicSocialsQuery({
    page: 1,
    limit: 20,
  });

  const createContactMutation = useCreatePublicContactMutation({
    onMutate: () => {
      setSubmitError(null);
      setSubmitted(true);
    },
    onError: (error) => {
      setSubmitted(false);
      setSubmitError(error.message || "Failed to submit your message.");
    },
  });

  const canSubmit =
    values.fullName.trim().length > 0 &&
    values.emailOrPhone.trim().length > 0 &&
    values.message.trim().length > 0;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || createContactMutation.isPending) {
      return;
    }

    const parsed = createPublicContactSchema.safeParse({
      fullName: values.fullName,
      contact: values.emailOrPhone,
      message: values.message,
      serviceId: null,
    });

    if (!parsed.success) {
      const issue =
        parsed.error.issues[0]?.message ?? "Invalid contact payload.";
      setSubmitError(issue);
      return;
    }

    createContactMutation.mutate(parsed.data);
  };

  const socials = socialsQuery.data?.data ?? [];

  return (
    <section className="landing-container landing-section-compact">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
        <div className="flex-1 flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <p className="font-sans text-muted-foreground text-[16px] uppercase">
              /Contact us
            </p>
            <h1 className="font-sans font-semibold text-foreground text-[32px] md:text-[40px] capitalize leading-[1.15]">
              We are here to help and answer your questions
            </h1>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className="font-sans font-semibold text-foreground text-[14px]">
                Phone Number
              </p>
              <div className="flex items-center gap-2">
                <PhoneIcon />
                <p className="font-sans text-muted-foreground text-[14px]">
                  + 251 90 000 0000 | + 251 90 000 0000
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-sans font-semibold text-foreground text-[14px]">
                Email Address
              </p>
              <div className="flex items-center gap-2">
                <EnvelopeIcon />
                <p className="font-sans text-muted-foreground text-[14px]">
                  contact@dsgeneralplc.com
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-sans font-semibold text-foreground text-[14px]">
                Address
              </p>
              <div className="flex items-center gap-2">
                <MapPinIcon />
                <p className="font-sans text-muted-foreground text-[14px]">
                  Addis Abeba, Ethiopia
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-sans font-medium text-foreground text-[16px]">
              Follow Us
            </p>
            <div className="flex gap-2 items-center flex-wrap">
              {socialsQuery.isError ? (
                <p className="text-sm text-muted-foreground">
                  Could not load social links.
                </p>
              ) : (
                socials.slice(0, 6).map((social) => (
                  <a
                    key={social.id}
                    href={social.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/5 flex items-center justify-center p-1.5 w-10.5 h-10.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    aria-label={social.title}
                  >
                    {social.iconUrl ? (
                      <img
                        src={social.iconUrl}
                        alt={social.title}
                        className="h-5 w-5 object-contain"
                      />
                    ) : (
                      socialIcon(social.title)
                    )}
                  </a>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-125 xl:w-183.5 shrink-0 bg-muted/40 px-6 py-10 md:px-12 md:py-16">
          {submitted ? (
            <div className="text-center py-10">
              <p className="font-sans font-medium text-primary text-[18px] mb-2">
                {createContactMutation.isPending
                  ? "Sending Message..."
                  : "Message Sent"}
              </p>
              <p className="font-sans text-muted-foreground text-[14px]">
                {createContactMutation.isPending
                  ? "Your message is being submitted."
                  : "Thank you for reaching out. We will get back to you shortly."}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-9">
              <h2 className="font-sans font-semibold text-foreground text-[28px] md:text-[32px] capitalize">
                Get in touch with us
              </h2>

              {submitError ? (
                <p className="text-sm text-destructive">{submitError}</p>
              ) : null}

              <div className="flex flex-col gap-3">
                <label htmlFor="contact-full-name" className="sr-only">
                  Full name
                </label>
                <Input
                  id="contact-full-name"
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  required
                  value={values.fullName}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      fullName: event.target.value,
                    }))
                  }
                  className="h-auto rounded-none border-border/60 bg-primary/5 px-4 py-3 font-sans text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:border-primary"
                />

                <label htmlFor="contact-email-or-phone" className="sr-only">
                  Email or phone number
                </label>
                <Input
                  id="contact-email-or-phone"
                  type="text"
                  name="emailOrPhone"
                  placeholder="Email or phone number"
                  required
                  value={values.emailOrPhone}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      emailOrPhone: event.target.value,
                    }))
                  }
                  className="h-auto rounded-none border-border/60 bg-primary/5 px-4 py-3 font-sans text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:border-primary"
                />

                <label htmlFor="contact-message" className="sr-only">
                  Your message
                </label>
                <Textarea
                  id="contact-message"
                  name="message"
                  placeholder="Your Message"
                  required
                  rows={6}
                  value={values.message}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      message: event.target.value,
                    }))
                  }
                  className="min-h-0 resize-none rounded-none border-border/60 bg-primary/5 px-4 py-3 font-sans text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:border-primary"
                />
              </div>

              <Button
                type="submit"
                disabled={!canSubmit || createContactMutation.isPending}
                className="h-auto w-full rounded-none bg-primary py-3 font-sans text-[20px] font-medium capitalize text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="w-full h-87.5 md:h-120.25 overflow-hidden mb-8">
        <img
          src={imgMap}
          alt="DS General PLC location - Addis Ababa, Ethiopia"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
