interface SectionHeaderProps {
  label: string;
  title: string;
  maxWidth?: string;
}

export function SectionHeader({
  label,
  title,
  maxWidth = "630px",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 items-start w-full">
      <p className="font-sans font-normal text-muted-foreground text-[16px] uppercase">
        {label}
      </p>
      <h2
        className="capitalize font-sans font-semibold text-foreground text-[24px] md:text-[40px]"
        style={{ maxWidth }}
      >
        {title}
      </h2>
    </div>
  );
}
