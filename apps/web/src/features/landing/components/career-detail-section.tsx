import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState, type FormEvent } from "react";

import { LexicalViewer } from "@/components/common/rich-text/LexicalViewer";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  usePublicVacanciesQuery,
  usePublicVacancyBySlugQuery,
  useSubmitPublicVacancyApplicationMutation,
} from "@/lib/vacancies/vacancies-query";
import { createPublicVacancyApplicationSchema } from "@/lib/vacancies/vacancies-schema";

function formatDate(value: string | null) {
  if (!value) return "Open until filled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Open until filled";
  return date.toLocaleDateString();
}

function EnumLabel({ value }: { value: string | null }) {
  if (!value) return null;
  return <span>{value.replaceAll("_", " ")}</span>;
}

function SidebarVacancyCard({
  slug,
  title,
  excerpt,
  deadlineAt,
  isActive,
}: {
  slug: string;
  title: string;
  excerpt: string | null;
  deadlineAt: string | null;
  isActive: boolean;
}) {
  return (
    <Link
      to="/career/$slug"
      params={{ slug }}
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
        {excerpt ?? "No summary available."}
      </p>
      <p className="font-sans text-primary text-[11px]">
        Deadline: {formatDate(deadlineAt)}
      </p>
    </Link>
  );
}

interface CareerDetailSectionProps {
  slug?: string;
}

type CareerApplicationValues = {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  portfolioUrl: string;
  coverLetter: string;
  consent: boolean;
  resume?: File;
};

export function CareerDetailSection({ slug }: CareerDetailSectionProps) {
  const navigate = useNavigate();
  const vacancyQuery = usePublicVacancyBySlugQuery(slug ?? "");
  const relatedVacanciesQuery = usePublicVacanciesQuery({
    page: 1,
    limit: 5,
    openOnly: true,
    sortBy: "publishedAt",
    sortOrder: "desc",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<CareerApplicationValues>({
    fullName: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    portfolioUrl: "",
    coverLetter: "",
    consent: false,
    resume: undefined,
  });

  const submitApplicationMutation = useSubmitPublicVacancyApplicationMutation({
    onMutate: () => {
      setSubmitError(null);
      setSubmitted(true);
    },
    onError: (error) => {
      setSubmitted(false);
      setSubmitError(error.message || "Failed to submit application.");
    },
  });

  if (vacancyQuery.isPending) {
    return (
      <section className="landing-container landing-section-compact">
        <div className="h-96 bg-muted/50 animate-pulse" />
      </section>
    );
  }

  if (vacancyQuery.isError || !vacancyQuery.data?.data) {
    return (
      <section className="landing-container landing-section text-center">
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

  const vacancy = vacancyQuery.data.data;
  const latestVacancies = (relatedVacanciesQuery.data?.data ?? [])
    .filter((item) => item.slug !== vacancy.slug)
    .slice(0, 4);

  const canSubmit =
    formValues.fullName.trim().length > 0 &&
    formValues.email.trim().length > 0 &&
    formValues.consent;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || submitApplicationMutation.isPending) {
      return;
    }

    const parsed = createPublicVacancyApplicationSchema.safeParse({
      fullName: formValues.fullName,
      email: formValues.email,
      phone: formValues.phone || undefined,
      resume: formValues.resume,
      portfolioUrl: formValues.portfolioUrl || undefined,
      linkedinUrl: formValues.linkedinUrl || undefined,
      coverLetter: formValues.coverLetter || undefined,
    });

    if (!parsed.success) {
      const issue =
        parsed.error.issues[0]?.message ?? "Invalid application data.";
      setSubmitError(issue);
      return;
    }

    submitApplicationMutation.mutate({
      vacancyId: vacancy.id,
      payload: parsed.data,
    });
  };

  return (
    <section className="landing-container landing-section-compact">
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

          <div className="relative mb-8 w-full overflow-hidden aspect-video md:aspect-16/8 bg-muted/40">
            {vacancy.featuredImageUrl ? (
              <ImageWithFallback
                src={vacancy.featuredImageUrl}
                alt={vacancy.title}
                className="h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-linear-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h1 className="mb-2 font-sans text-[22px] font-semibold text-primary-foreground md:text-[28px]">
                {vacancy.title}
              </h1>
              <p className="max-w-137.5 font-sans text-[14px] text-primary-foreground/80 md:text-[16px]">
                {vacancy.excerpt ?? "Join our team."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8 font-sans text-[13px] uppercase text-muted-foreground">
            <EnumLabel value={vacancy.department} />
            <EnumLabel value={vacancy.location} />
            <EnumLabel value={vacancy.workplaceType} />
            <EnumLabel value={vacancy.employmentType} />
            <EnumLabel value={vacancy.seniority} />
            <span>Deadline: {formatDate(vacancy.deadlineAt)}</span>
          </div>

          <div className="mb-12 space-y-4">
            {vacancy.description.includes("<") ? (
              <LexicalViewer content={vacancy.description} />
            ) : (
              <p className="font-sans text-muted-foreground text-[15px] leading-[1.7] whitespace-pre-wrap">
                {vacancy.description}
              </p>
            )}
          </div>

          <div className="border border-border/60 p-6 md:p-10">
            <h2 className="mb-8 font-sans text-[22px] font-semibold text-foreground md:text-[26px]">
              Apply
            </h2>

            {submitted ? (
              <div className="py-10 text-center">
                <p className="mb-2 font-sans text-[18px] font-medium text-primary">
                  {submitApplicationMutation.isPending
                    ? "Submitting your application..."
                    : "Application Submitted"}
                </p>
                <p className="font-sans text-[14px] text-muted-foreground">
                  {submitApplicationMutation.isPending
                    ? "Your application is being sent."
                    : "Thank you for applying. We will review your application and get back to you soon."}
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-6">
                {submitError ? (
                  <p className="text-sm text-destructive">{submitError}</p>
                ) : null}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                    <Input
                      id="fullName"
                      type="text"
                      required
                      value={formValues.fullName}
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          fullName: event.target.value,
                        }))
                      }
                      className="h-auto rounded-none border-border/60 bg-transparent px-4 py-3 font-sans text-[14px] text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formValues.email}
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      className="h-auto rounded-none border-border/60 bg-transparent px-4 py-3 font-sans text-[14px] text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="phone">Phone (Optional)</FieldLabel>
                    <Input
                      id="phone"
                      type="tel"
                      value={formValues.phone}
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          phone: event.target.value,
                        }))
                      }
                      className="h-auto rounded-none border-border/60 bg-transparent px-4 py-3 font-sans text-[14px] text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="resume">Resume (Optional)</FieldLabel>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        setFormValues((prev) => ({
                          ...prev,
                          resume: file,
                        }));
                      }}
                      className="h-auto rounded-none border-border/60 bg-transparent px-4 py-2.5 font-sans text-[14px] text-foreground"
                    />
                    {formValues.resume ? (
                      <p className="text-xs text-muted-foreground">
                        {formValues.resume.name}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="linkedinUrl">
                      Linkedin profile URL (Optional)
                    </FieldLabel>
                    <Input
                      id="linkedinUrl"
                      type="url"
                      value={formValues.linkedinUrl}
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          linkedinUrl: event.target.value,
                        }))
                      }
                      className="h-auto rounded-none border-border/60 bg-transparent px-4 py-3 font-sans text-[14px] text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="portfolioUrl">
                      Portfolio URL (Optional)
                    </FieldLabel>
                    <Input
                      id="portfolioUrl"
                      type="url"
                      value={formValues.portfolioUrl}
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          portfolioUrl: event.target.value,
                        }))
                      }
                      className="h-auto rounded-none border-border/60 bg-transparent px-4 py-3 font-sans text-[14px] text-foreground"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="coverLetter">
                    Cover letter (Optional)
                  </FieldLabel>
                  <Textarea
                    id="coverLetter"
                    rows={5}
                    placeholder="Tell us why you're a great fit."
                    value={formValues.coverLetter}
                    onChange={(event) =>
                      setFormValues((prev) => ({
                        ...prev,
                        coverLetter: event.target.value,
                      }))
                    }
                    className="min-h-0 resize-none rounded-none border-border/60 bg-transparent px-4 py-3 font-sans text-[14px] text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={formValues.consent}
                    onCheckedChange={(checked) =>
                      setFormValues((prev) => ({
                        ...prev,
                        consent: Boolean(checked),
                      }))
                    }
                    className="mt-1"
                  />
                  <FieldLabel
                    htmlFor="consent"
                    className="font-sans text-[13px] font-normal text-muted-foreground"
                  >
                    I consent to having my data processed for recruitment
                    purposes.
                  </FieldLabel>
                </div>

                <Button
                  type="submit"
                  disabled={!canSubmit || submitApplicationMutation.isPending}
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
          {relatedVacanciesQuery.isError ? (
            <p className="text-sm text-muted-foreground">
              Could not load related vacancies.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {latestVacancies.map((item) => (
                <SidebarVacancyCard
                  key={item.id}
                  slug={item.slug}
                  title={item.title}
                  excerpt={item.excerpt}
                  deadlineAt={item.deadlineAt}
                  isActive={item.slug === slug}
                />
              ))}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
