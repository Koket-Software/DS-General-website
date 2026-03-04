import { useState } from "react";

import { YoutubeIcon, XIcon, InstagramIcon, LinkedinIcon } from "./icons";
import imgMap from "../../../../assets/1996b890973697a0ece35083743bf5f2cd592a73.png";
import svgPaths from "../../../../imports/svg-b3plelej3t";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppForm } from "@/lib/forms";

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

type ContactFormValues = {
  fullName: string;
  emailOrPhone: string;
  message: string;
};

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const form = useAppForm<ContactFormValues>({
    defaultValues: {
      fullName: "",
      emailOrPhone: "",
      message: "",
    },
    onSubmit: async () => {
      setSubmitted(true);
    },
  });

  const canSubmit =
    form.state.values.fullName.trim().length > 0 &&
    form.state.values.emailOrPhone.trim().length > 0 &&
    form.state.values.message.trim().length > 0;

  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-24 py-10 md:py-16">
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
            <div className="flex gap-2 items-center">
              <a
                href="#"
                className="bg-primary/5 flex items-center justify-center p-1.5 w-10.5 h-10.5"
              >
                <YoutubeIcon />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10.5 h-10.5"
              >
                <XIcon />
              </a>
              <a
                href="#"
                className="bg-primary/5 flex items-center justify-center p-1.5 w-10.5 h-10.5"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                className="bg-primary/5 flex items-center justify-center p-1.5 w-10.5 h-10.5"
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-125 xl:w-183.5 shrink-0 bg-muted/40 px-6 md:px-24 py-10 md:py-16">
          {submitted ? (
            <div className="text-center py-10">
              <p className="font-sans font-medium text-primary text-[18px] mb-2">
                Message Sent!
              </p>
              <p className="font-sans text-muted-foreground text-[14px]">
                Thank you for reaching out. We will get back to you shortly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                form.handleSubmit();
              }}
              className="flex flex-col gap-9"
            >
              <h2 className="font-sans font-semibold text-foreground text-[28px] md:text-[32px] capitalize">
                Get in touch with us
              </h2>

              <div className="flex flex-col gap-3">
                <form.Field name="fullName">
                  {(field) => (
                    <Input
                      type="text"
                      name={field.name}
                      placeholder="Full name"
                      required
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      className="h-auto rounded-none border-border/60 bg-primary/5 px-4 py-3 font-sans text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:border-primary"
                    />
                  )}
                </form.Field>

                <form.Field name="emailOrPhone">
                  {(field) => (
                    <Input
                      type="text"
                      name={field.name}
                      placeholder="Email or phone number"
                      required
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      className="h-auto rounded-none border-border/60 bg-primary/5 px-4 py-3 font-sans text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:border-primary"
                    />
                  )}
                </form.Field>

                <form.Field name="message">
                  {(field) => (
                    <Textarea
                      name={field.name}
                      placeholder="Your Message"
                      required
                      rows={6}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      className="min-h-0 resize-none rounded-none border-border/60 bg-primary/5 px-4 py-3 font-sans text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:border-primary"
                    />
                  )}
                </form.Field>
              </div>

              <Button
                type="submit"
                disabled={!canSubmit}
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
