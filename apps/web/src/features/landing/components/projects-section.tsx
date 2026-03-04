import { SectionHeader } from "./section-header";
import imgRect2 from "../../../../assets/10c9dc8899596b9d66a053fd8064282e00c6116e.png";
import imgRect4 from "../../../../assets/475683c8af3ca6892040d6e9be871ecee7b3339c.png";
import imgRect6 from "../../../../assets/bd62d23a1354b45ba160ba564b3da5b331aa77ec.png";
import imgRect3 from "../../../../assets/e72c58ac672cdae5523f025d328dcea878a62590.png";
import imgRect7 from "../../../../assets/ee7b280cddcad41d21c05e1ed30c91422de67238.png";
import imgRect5 from "../../../../assets/fb23da6ef97dcb0a5ae807f625c52d38f0cdb079.png";

interface ProjectCardProps {
  image: string;
  date: string;
  title: string;
  wide?: boolean;
}

function ProjectCard({ image, date, title, wide }: ProjectCardProps) {
  return (
    <div
      className={`border border-border/60 flex flex-col overflow-hidden ${wide ? "flex-[1.4]" : "flex-1"}`}
    >
      <div className="h-50 relative bg-primary">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <p className="font-sans font-normal text-muted-foreground text-[14px]">
          {date}
        </p>
        <p className="font-sans font-semibold text-foreground text-[16px]">
          {title}
        </p>
      </div>
    </div>
  );
}

const projectsRow1 = [
  {
    image: imgRect2,
    date: "Sep 15, 2025",
    title: "Horizon FinTech Headquarters, Addis Ababa",
    wide: true,
  },
  {
    image: imgRect3,
    date: "Sep 15, 2025",
    title: "Sheger Luxury Residential Complex",
    wide: false,
  },
  {
    image: imgRect4,
    date: "Sep 15, 2025",
    title: "Regional Bank Office Supply Import",
    wide: false,
  },
];

const projectsRow2 = [
  {
    image: imgRect5,
    date: "Sep 15, 2025",
    title: "Modjo Manufacturing Hub Material Import",
    wide: false,
  },
  {
    image: imgRect6,
    date: "Sep 15, 2025",
    title: "Unity Tech Campus Expansion",
    wide: false,
  },
  {
    image: imgRect7,
    date: "Sep 15, 2025",
    title: "Cosmetics Import Partnership With Beyou",
    wide: true,
  },
];

export function ProjectsSection() {
  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 py-16 md:py-24">
      <SectionHeader
        label="/Featured Project"
        title="Explore the works we have done with our trusted partners"
      />

      <div className="mt-10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          {projectsRow1.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {projectsRow2.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
