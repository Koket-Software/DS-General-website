import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { vacancies } from "../data/careers-data";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppForm } from "@/lib/forms";

const heroImage =
  "https://images.unsplash.com/photo-1636390612677-bd144f4cdc80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGNoYWlycyUyMHdhaXRpbmclMjByb29tJTIwaGlyaW5nfGVufDF8fHx8MTc3MjE4MjQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

function SidebarVacancyCard({
  id,
  title,
  description,
  deadline,
  isActive,
}: {
  id: string;
  title: string;
  description: string;
  deadline: string;
  isActive: boolean;
}) {
  return (
    <Link
      to="/career/$id"
      params={{ id }}
      className={`block border p-5 no-underline transition-colors ${
        isActive
          ? "border-primary bg-primary/5"
          : "border-border/60 hover:border-primary/40"
      }`}
    >
      <p className="font-sans font-medium text-foreground text-[14px] mb-1">
        {title}
      </p>
      <p className="font-sans text-muted-foreground text-[12px] line-clamp-2 mb-2">
        {description}
      </p>
      <p className="font-sans text-primary text-[11px]">Deadline: {deadline}</p>
    </Link>
  );
}

interface CareerDetailSectionProps {
  id?: string;
}

type CareerApplicationValues = {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  coverLetter: string;
  consent: boolean;
};

export function CareerDetailSection({ id }: CareerDetailSectionProps) {
  const navigate = useNavigate();
  const vacancy = vacancies.find((v) => v.id === id);

  const [submitted, setSubmitted] = useState(false);
  const [resumeFileName, setResumeFileName] = useState<string>("");
  const [portfolioFileName, setPortfolioFileName] = useState<string>("");

  const form = useAppForm<CareerApplicationValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      coverLetter: "",
      consent: false,
    },
    onSubmit: async () => {
      setSubmitted(true);
    },
  });

  if (!vacancy) {
    return (
      <section className="max-w-360 mx-auto px-6 md:px-24 py-16 text-center">
        <p className="font-sans text-muted-foreground text-[18px] mb-6">
          This vacancy was not found.
        </p>
        <Link
          to="/career"
          className="font-sans font-medium text-primary text-[16px] no-underline hover:opacity-80"
        >
          &larr; Back to Careers
        </Link>
      </section>
    );
  }

  const canSubmit =
    form.state.values.fullName.trim().length > 0 &&
    form.state.values.email.trim().length > 0 &&
    form.state.values.consent;

  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        <div className="flex-1 min-w-0">
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate({ to: "/career" })}
            className="mb-6 flex items-center gap-2 bg-transparent p-0 font-sans text-[14px] text-foreground hover:bg-transparent hover:text-primary"
          >
            <ArrowLeft size={16} />
            <span>Career</span>
          </Button>

          <div className="relative mb-8 w-full overflow-hidden aspect-video md:aspect-16/8">
            <ImageWithFallback
              src={heroImage}
              alt={vacancy.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h1 className="mb-2 font-sans text-[22px] font-semibold text-primary-foreground md:text-[28px]">
                {vacancy.title}
              </h1>
              <p className="max-w-137.5 font-sans text-[14px] text-primary-foreground/80 md:text-[16px]">
                {vacancy.description}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <p className="font-sans text-muted-foreground text-[15px] leading-[1.7]">
              {vacancy.detailDescription}
            </p>
          </div>

          <div className="mb-8">
            <p className="mb-3 font-sans text-[16px] font-semibold text-foreground">
              Key Responsibilities:
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-6">
              {vacancy.responsibilities.map((item, index) => (
                <li
                  key={index}
                  className="font-sans text-[15px] leading-[1.6] text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-12">
            <p className="mb-3 font-sans text-[16px] font-semibold text-foreground">
              Requirements:
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-6">
              {vacancy.requirements.map((item, index) => (
                <li
                  key={index}
                  className="font-sans text-[15px] leading-[1.6] text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border/60 p-6 md:p-10">
            <h2 className="mb-8 font-sans text-[22px] font-semibold text-foreground md:text-[26px]">
              Apply
            </h2>

            {submitted ? (
              <div className="py-10 text-center">
                <p className="mb-2 font-sans text-[18px] font-medium text-primary">
                  Application Submitted!
                </p>
                <p className="font-sans text-[14px] text-muted-foreground">
                  Thank you for applying. We will review your application and
                  get back to you soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  form.handleSubmit();
                }}
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <form.Field name="fullName">
                    {(field) => (
                      <div className="flex flex-col gap-2">
                        <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                        <Input
                          id={field.name}
                          type="text"
                          name={field.name}
                          required
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          className="h-auto rounded-none border-border/60 bg-transparent px-4 py-3 font-sans text-[14px] text-foreground"
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="email">
                    {(field) => (
                      <div className="flex flex-col gap-2">
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          type="email"
                          name={field.name}
                          required
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          className="h-auto rounded-none border-border/60 bg-transparent px-4 py-3 font-sans text-[14px] text-foreground"
                        />
                      </div>
                    )}
                  </form.Field>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <form.Field name="phone">
                    {(field) => (
                      <div className="flex flex-col gap-2">
                        <FieldLabel htmlFor={field.name}>
                          Phone (Optional)
                        </FieldLabel>
                        <Input
                          id={field.name}
                          type="tel"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          className="h-auto rounded-none border-border/60 bg-transparent px-4 py-3 font-sans text-[14px] text-foreground"
                        />
                      </div>
                    )}
                  </form.Field>

                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="resume">Resume (Optional)</FieldLabel>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        setResumeFileName(file?.name ?? "");
                      }}
                      className="h-auto rounded-none border-border/60 bg-transparent px-4 py-2.5 font-sans text-[14px] text-foreground"
                    />
                    {resumeFileName ? (
                      <p className="text-xs text-muted-foreground">
                        {resumeFileName}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <form.Field name="linkedinUrl">
                    {(field) => (
                      <div className="flex flex-col gap-2">
                        <FieldLabel htmlFor={field.name}>
                          Linkedin profile URL (Optional)
                        </FieldLabel>
                        <Input
                          id={field.name}
                          type="url"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          className="h-auto rounded-none border-border/60 bg-transparent px-4 py-3 font-sans text-[14px] text-foreground"
                        />
                      </div>
                    )}
                  </form.Field>

                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="portfolio">
                      Portfolio (Optional)
                    </FieldLabel>
                    <Input
                      id="portfolio"
                      type="file"
                      accept=".pdf,.doc,.docx,.zip"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        setPortfolioFileName(file?.name ?? "");
                      }}
                      className="h-auto rounded-none border-border/60 bg-transparent px-4 py-2.5 font-sans text-[14px] text-foreground"
                    />
                    {portfolioFileName ? (
                      <p className="text-xs text-muted-foreground">
                        {portfolioFileName}
                      </p>
                    ) : null}
                  </div>
                </div>

                <form.Field name="coverLetter">
                  {(field) => (
                    <div className="flex flex-col gap-2">
                      <FieldLabel htmlFor={field.name}>
                        Cover letter (Optional)
                      </FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        rows={5}
                        placeholder="Tell us why you're a great fit."
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        className="min-h-0 resize-none rounded-none border-border/60 bg-transparent px-4 py-3 font-sans text-[14px] text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="consent">
                  {(field) => (
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={field.name}
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(Boolean(checked))
                        }
                        className="mt-1"
                      />
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-sans text-[13px] font-normal text-muted-foreground"
                      >
                        I consent to having my data processed for recruitment
                        purposes.
                      </FieldLabel>
                    </div>
                  )}
                </form.Field>

                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full rounded-none bg-primary py-4 font-sans text-[16px] font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit Application
                </Button>
              </form>
            )}
          </div>
        </div>

        <aside className="hidden lg:block w-70 xl:w-79 shrink-0 sticky top-20">
          <p className="font-sans text-muted-foreground text-[14px] mb-4">
            Latest Vacancies
          </p>
          <div className="flex flex-col gap-3">
            {vacancies.map((v) => (
              <SidebarVacancyCard
                key={v.id}
                id={v.id}
                title={v.title}
                description={v.description}
                deadline={v.deadline}
                isActive={v.id === id}
              />
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
