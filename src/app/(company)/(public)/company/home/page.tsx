"use client";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Atom,
  Cpu,
  Database,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@radix-ui/themes";
import { Box } from "@radix-ui/themes";
import { useSession } from "next-auth/react";

const BOX_STYLE = {
  background: "var(--gray-a2)",
  borderRadius: "var(--radius-3)",
};

const STATS = {
  reviewCount: "1M",
  rating: "4.6",
  companyCount: "2K",
};

const EFFICIENT_SOLUTIONS = [
  "Robust Resume Search",
  "Flexible and Performance",
  "Efficient Recruiting Process",
  "Increase your visibility",
];

const STRATEGY_CARDS = [
  {
    title: "Candidate Sourcing",
    text: "Find skilled candidates faster with smart filters, strong talent pools, and personalized recommendations that match your role needs.",
  },
  {
    title: "Tech Job Posts",
    text: "Create optimized job posts with clear requirements, SEO-friendly structure, and rich media that improve qualified applications.",
  },
  {
    title: "Career Events",
    text: "Host virtual and on-site events to engage candidates early, highlight your culture, and build long-term hiring pipelines.",
  },
  {
    title: "Permit Sourcing",
    text: "Reach global candidates and manage compliance-ready hiring with structured workflows and verified documentation support.",
  },
];

const TESTIMONIALS = [
  {
    text: "JOBLIN helped us cut hiring time in half and consistently delivers candidates that match both role and culture.",
    name: "Maya Lee",
    role: "People Ops Lead",
    company: "Northwind",
    avatar: "/avater.jpg",
  },
  {
    text: "We filled three critical positions in two weeks. The workflow and screening tools are simple and effective.",
    name: "Omar Hassan",
    role: "Talent Partner",
    company: "BluePeak",
    avatar: "/avater.jpg",
  },
  {
    text: "The quality of applicants improved instantly. JOBLIN makes it easy to prioritize and collaborate on hiring.",
    name: "Sofia Martinez",
    role: "HR Manager",
    company: "Maple Labs",
    avatar: "/avater.jpg",
  },
];

export default function ForCompaniesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [jobTitle, setJobTitle] = useState("Web Developer");
  const [jobType, setJobType] = useState("Full-Time");
  const [experience, setExperience] = useState("More than 2 years");

  const handlePostJob = useCallback(() => {
    if (!isAuthenticated) {
      router.push("/login/company");
      return;
    }
    const params = new URLSearchParams({
      title: jobTitle,
      type: jobType,
      experience: experience,
    });
    router.push(`/company/post-job?${params.toString()}`);
  }, [isAuthenticated, jobTitle, jobType, experience, router]);

  const trustedCards = [
    { label: "Review", value: STATS.reviewCount },
    { label: "Rating", value: STATS.rating },
    { label: "Company", value: STATS.companyCount },
  ];

  return (
    <div className="text-[#101825]">
      <div>
        {/* Full-width background reaching the very top */}
        <div className="w-full bg-[#f6f7f8] pt-36 pb-16 lg:pt-40 lg:pb-20">
          <section className="mx-auto grid w-[92%] max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="max-w-xl text-4xl leading-[1.15] font-bold text-black md:text-6xl">
                Hire Smarter, Grow Faster with{" "}
                <span className="text-[#02905E]">JOBLIN!</span>
              </h1>

              <p className="mt-5 max-w-xl text-lg text-[#717985]">
                Post your job openings on JOBLIN and connect with thousands of
                top professionals. With advanced tools, smart matching systems,
                and a user-friendlyr.
              </p>

              <div id="post-job" className="mt-7">
                {status === "loading" ? (
                  <div className="inline-flex items-center gap-2 rounded-lg bg-[#1f2023] px-7 py-4 text-lg font-semibold text-white animate-pulse">
                    Post a job
                  </div>
                ) : isAuthenticated ? (
                  <Link
                    href="/company/post-job"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1f2023] px-7 py-4 text-lg font-semibold text-white transition hover:bg-black"
                  >
                    Post a job
                  </Link>
                ) : (
                  <Link
                    href="/register/company"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1f2023] px-7 py-4 text-lg font-semibold text-white transition hover:bg-black"
                  >
                    Post a job
                  </Link>
                )}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl">
              <Image
                src="/company-hero-visual.png"
                alt="Company hero visual"
                width={1288}
                height={1248}
                className="h-auto w-full"
                priority
              />
            </div>
          </section>
        </div>

        <Box style={BOX_STYLE}>
          <Container size="1">
            <section className="mx-auto w-[92%] max-w-7xl py-14">
              <div className="text-center">
                <h2 className="text-4xl font-semibold text-black md:text-5xl">
                  Trused by 2K companies
                </h2>
                <p className="mt-3 text-[#6f7784]">
                  Comments from companies that have hired you
                </p>
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-3 justify-center">
                {trustedCards.map((card) => (
                  <article
                    key={card.label}
                    className="max-w-80 inline-flex justify-between items-end gap-8 rounded-2xl border border-[#e4e7ea] bg-white p-6 shadow-[2px_4px_32px_0px_rgba(1,70,177,0.08)]"
                  >
                    <div className="inline-flex flex-col justify-start items-start gap-1">
                      <p className="text-center text-xl md:text-2xl font-medium text-[#6f7784]">
                        {card.label}
                      </p>
                      <p className="text-center text-4xl mt-1 md:text-5xl font-semibold">
                        {card.value}
                      </p>
                    </div>

                    <div className="mt-4 h-16 rounded-xl">
                      <Image
                        src={`/Charts.svg`}
                        alt={`${card.label} illustration`}
                        width={64}
                        height={64}
                        className="h-auto w-auto"
                      />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="search-cv"
              className="mx-auto flex flex-col w-[92%] max-w-[1200px] justify-start items-center gap-12 py-16 overflow-hidden"
            >
              <div className="self-stretch flex flex-col justify-start items-center gap-6">
                <div className="self-stretch flex flex-col items-center gap-3">
                  <h2 className="text-4xl font-semibold text-neutral-800 md:text-5xl text-center">
                    Built for companies of all sizes
                  </h2>
                  <p className="max-w-[600px] text-neutral-500 text-center text-lg font-normal leading-relaxed">
                    {"\"We're the best one platform that connects you straight to the person who knows your job inside out.\""}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-2">
                  {status === "loading" ? (
                    <div className="w-56 h-12 px-4 py-2 bg-zinc-800 rounded-lg flex justify-center items-center gap-2 text-lg font-medium text-white animate-pulse">
                      Loading…
                    </div>
                  ) : isAuthenticated ? (
                    <Link
                      href="/company/profile"
                      className="w-56 h-12 px-4 py-2 bg-zinc-800 rounded-lg flex justify-center items-center gap-2 text-lg font-medium text-white hover:bg-zinc-900 transition"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/register/company"
                      className="w-56 h-12 px-4 py-2 bg-zinc-800 rounded-lg flex justify-center items-center gap-2 text-lg font-medium text-white hover:bg-zinc-900 transition"
                    >
                      Join for free
                    </Link>
                  )}
                  <Link
                    href="#pricing"
                    className="w-56 h-12 px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-800 flex justify-center items-center gap-2 text-lg font-medium text-zinc-800 hover:bg-zinc-50 transition"
                  >
                    See our plans
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="w-full flex justify-center mt-6">
                <Image
                  src="/company-cta-illustration.png"
                  alt="Trusted companies"
                  width={2464}
                  height={412}
                  className="w-full h-auto max-w-5xl"
                />
              </div>
            </section>

            <section id="products" className="mx-auto w-[92%] max-w-7xl py-14">
              <div>
                <h2 className="text-4xl font-semibold text-black md:text-5xl">
                  Efficient solutions for hiring success
                </h2>
                <p className="mt-2 max-w-2xl text-[#6f7784]">
                  Optimize your recruitment with powerful tools for search,
                  performance, efficiency, and visibility.
                </p>
              </div>

              <div className="mt-8 grid gap-5 grid-cols-2 lg:grid-cols-4 ">
                {EFFICIENT_SOLUTIONS.map((title, idx) => (
                  <article
                    key={title}
                    className="rounded-2xl bg-white p-6 w-72 mx-auto text-center outline -outline-offset-1 outline-gray-200 inline-flex flex-col justify-start items-center gap-2"
                  >
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-xl text-[#2C8BFF]">
                      {(idx === 0 && (
                        <Database color="hsla(159, 97%, 29%, 1)" size={100} />
                      )) ||
                        (idx === 1 && (
                          <Cpu color="hsla(159, 97%, 29%, 1)" size={100} />
                        )) ||
                        (idx === 2 && (
                          <Atom color="hsla(159, 97%, 29%, 1)" size={100} />
                        )) ||
                        (idx === 3 && (
                          <ShieldCheck
                            color="hsla(159, 97%, 29%, 1)"
                            size={100}
                          />
                        ))}
                    </div>
                    <h3 className="mt-4 text-lg md:text-3xl font-semibold text-[#1a2330]">
                      {title}
                    </h3>
                    <p className="mt-2 text-[#606a78] text-sm font-medium leading-6">
                      Sponser your work to make sure the right people see it.
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mx-auto w-[92%] max-w-7xl py-14 flex flex-col gap-8">
              <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                <h2 className="text-4xl font-semibold text-neutral-800 md:text-5xl">
                  Elevate your hiring strategy
                </h2>
                <p className="max-w-[500px] mt-2 text-neutral-500 text-base leading-6">
                  Treamline your recruitment process with innovative solutions
                  for sourcing, job posts, career events, and flexible hiring.
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                {STRATEGY_CARDS.map((card, index) => {
                  const isOpen = activeIndex === index;
                  return (
                    <article
                      key={card.title}
                      onClick={() => setActiveIndex(index)}
                      className={`group relative flex flex-col justify-between p-8 rounded-2xl h-[540px] cursor-pointer transition-all duration-500 ease-out overflow-hidden ${
                        isOpen
                          ? "bg-gray-200 lg:flex-[1.7] shadow-sm"
                          : "bg-stone-50 border border-stone-100 hover:bg-stone-100 lg:flex-1"
                      }`}
                    >
                      <div className="flex flex-col gap-8 w-full relative z-10">
                        <h3
                          className={`text-2xl font-medium transition-colors duration-300 ${isOpen ? "text-neutral-800 font-semibold" : "text-neutral-800"}`}
                        >
                          {card.title}
                        </h3>
                        <p
                          className={`text-lg leading-7 transition-colors duration-300 ${isOpen ? "text-neutral-600 line-clamp-[11]" : "text-neutral-500 line-clamp-[10]"}`}
                        >
                          {card.text}
                        </p>
                      </div>

                      <div
                        className={`relative z-10 shrink-0 transition-all duration-500 ease-out flex flex-col justify-end ${
                          isOpen
                            ? "opacity-100 h-12 mt-8 translate-y-0"
                            : "opacity-0 h-0 mt-0 translate-y-4 pointer-events-none"
                        }`}
                      >
                        <Link
                          href={status === "loading" ? "#" : (isAuthenticated ? "/company/post-job" : "/register/company")}
                          className={`flex justify-center items-center h-12 w-full rounded-lg bg-zinc-800 text-lg font-medium text-white hover:bg-zinc-700 transition ${status === "loading" ? "animate-pulse pointer-events-none" : ""}`}
                          onClick={(e) => {
                            if (!isOpen) e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          Find Top Talent
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="mx-auto w-[92%] max-w-7xl py-14 flex flex-col justify-start items-center gap-8">
              <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1 flex flex-col justify-start items-start gap-2">
                  <h2 className="text-neutral-800 text-4xl font-semibold">
                    The result are in - Our clients win
                  </h2>
                  <p className="max-w-[500px] text-neutral-500 text-base font-normal leading-6">
                    {"The proof is in the partnerships, Here's why companies choose power to fly for building engaged and inclusive workforces."}
                  </p>
                </div>
              </div>

              <div className="w-full flex flex-col justify-start items-center gap-6">
                <div className="w-full grid md:grid-cols-3 gap-6">
                  {TESTIMONIALS.map((item) => (
                    <article
                      key={item.name}
                      className="p-6 bg-stone-50 rounded-lg flex flex-col justify-start items-start gap-6 border border-stone-100"
                    >
                      <div className="text-5xl font-serif text-neutral-800 leading-none h-8 mt-2">
                        &ldquo;
                      </div>

                      <p className="min-h-[100px] text-zinc-800 text-base font-normal leading-6">
                        {item.text}
                      </p>

                      <div className="w-full h-px bg-gray-200" />

                      <div className="w-full flex justify-start items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
                          <Image
                            src={item.avatar}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-center items-start gap-1">
                          <h4 className="text-neutral-800 text-base font-medium">
                            {item.name}
                          </h4>
                          <p className="text-neutral-500 text-xs font-normal">
                            {item.role}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-4 h-4 bg-emerald-600 rounded flex items-center justify-center text-white shrink-0">
                              <Atom size={10} />
                            </div>
                            <span className="text-neutral-500 text-xs font-medium">
                              {item.company}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="h-4 flex justify-center items-center gap-2 mt-4">
                  <div className="w-2 h-2 bg-neutral-800 rounded-full" />
                  <div className="w-2 h-2 rounded-full border border-stone-300" />
                  <div className="w-2 h-2 rounded-full border border-stone-300" />
                  <div className="w-2 h-2 rounded-full border border-stone-300" />
                  <div className="w-2 h-2 rounded-full border border-stone-300" />
                </div>
              </div>
            </section>

            <section
              id="pricing"
              className="relative overflow-hidden bg-zinc-800 py-24 text-white"
            >
              <div className="mx-auto flex w-[92%] max-w-7xl flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
                <div className="flex w-full max-w-[480px] flex-col justify-start items-start gap-11">
                  <div className="flex flex-col justify-start items-start gap-9">
                    <h2 className="text-5xl font-bold font-['Inter'] leading-tight">
                      Our plans to buy for more features
                    </h2>
                    <p className="text-neutral-400 text-lg font-medium font-['Inter'] leading-relaxed">
                      You can find various solutions just by accessing our
                      platform. Because we are committed to maintaining the
                      quality of user service
                    </p>
                  </div>
                  <button className="w-72 h-14 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 transition rounded-lg flex justify-center items-center gap-2">
                    <span className="text-white text-xl font-medium font-['Inter']">
                      Buy
                    </span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-start items-end gap-8 lg:gap-12 w-full lg:w-auto">
                  {/* First Card - Roberto Alexander */}
                  <div className="w-60 p-5 bg-white rounded-lg shadow-[0px_4px_14px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start gap-6 text-neutral-800">
                    <div className="w-full flex flex-col justify-start items-start gap-4">
                      <div className="flex flex-col justify-start items-start gap-2">
                        <div className="flex justify-start items-center gap-2">
                          <div className="flex -space-x-4">
                            <div className="w-10 h-10 rounded-full border-[3px] border-white bg-emerald-600 relative z-10" />
                            <div className="w-10 h-10 rounded-full border-[3px] border-white bg-blue-200 relative z-20 flex items-center justify-center overflow-hidden">
                              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs text-blue-800 font-bold">
                                RA
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-start items-start ml-1">
                            <span className="text-neutral-800 text-sm font-semibold font-['Inter']">
                              Roberto Alexander
                            </span>
                            <span className="text-neutral-400 text-xs font-normal font-['Inter']">
                              UI/UX Designer
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-start items-start gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="w-3.5 h-3.5 bg-yellow-500 rounded-sm"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-neutral-800 text-[13px] font-medium font-['Inter'] leading-5">
                        {"\"It's amazing, using this platform really helped me in finding a job according to my field. Thanks a lot jofind!.\""}
                      </p>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                      </div>
                      <span className="text-neutral-400 text-xs font-normal font-['Inter']">
                        This week
                      </span>
                    </div>
                  </div>

                  {/* Second Card - Job Form */}
                  <div className="w-full sm:w-[320px] px-6 pt-8 pb-6 bg-white rounded-lg shadow-[0px_4px_14px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start gap-6">
                    <div className="w-full flex flex-col justify-start items-start gap-4">
                      <div className="w-full flex flex-col gap-5">
                        <div className="relative w-full">
                          <div className="px-2 bg-white absolute -top-2.5 left-3 text-neutral-800 text-xs font-medium font-['Inter'] z-10">
                            Job Title
                          </div>
                          <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="w-full h-11 px-4 rounded-lg border border-neutral-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-zinc-800 text-sm font-normal font-['Inter']"
                          />
                        </div>
                        <div className="relative w-full">
                          <div className="px-2 bg-white absolute -top-2.5 left-3 text-neutral-800 text-xs font-medium font-['Inter'] z-10">
                            Job Type
                          </div>
                          <input
                            type="text"
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            className="w-full h-11 px-4 rounded-lg border border-neutral-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-zinc-800 text-sm font-normal font-['Inter']"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {jobTitle && (
                          <div className="px-2 py-1.5 bg-gray-200 rounded-md flex items-center gap-1.5">
                            <span className="text-neutral-700 text-[13px] font-normal">
                              {jobTitle}
                            </span>
                            <button
                              onClick={() => setJobTitle("")}
                              className="text-neutral-700 text-[11px] opacity-70 hover:opacity-100 transition"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        {jobType && (
                          <div className="px-2 py-1.5 bg-gray-200 rounded-md flex items-center gap-1.5">
                            <span className="text-neutral-700 text-[13px] font-normal">
                              {jobType}
                            </span>
                            <button
                              onClick={() => setJobType("")}
                              className="text-neutral-700 text-[11px] opacity-70 hover:opacity-100 transition"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full flex flex-col gap-4 mt-2">
                      <h4 className="text-neutral-800 text-base font-semibold font-['Inter']">
                        Experience Level
                      </h4>
                      <div className="grid grid-cols-[1fr_1.2fr] gap-y-3 gap-x-2">
                        {[
                          "1 years",
                          "Less than 1 year",
                          "2 years",
                          "More than 2 years",
                        ].map((level) => (
                          <div
                            key={level}
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => setExperience(level)}
                          >
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${experience === level ? "border-2 border-emerald-600 bg-emerald-50" : "border-2 border-stone-300 group-hover:border-emerald-400"}`}
                            >
                              {experience === level && (
                                <svg
                                  className="w-3.5 h-3.5 text-emerald-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-neutral-700 text-[13px] font-normal">
                              {level}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handlePostJob}
                      className="w-full h-11 mt-2 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition text-[15px] font-medium"
                    >
                      Post Job
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </Container>
        </Box>
      </div>
    </div>
  );
}
