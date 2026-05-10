import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Clock, GraduationCap } from "lucide-react";
import tutorialsData from "@/content/tutorials.json";
import GrainientBackground from "./GrainientBackground";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tutorialsData.map((t) => ({ slug: t.slug }));
}

export default async function TutorialPage({ params }: Props) {
  const { slug } = await params;
  const meta = tutorialsData.find((t) => t.slug === slug);
  if (!meta) notFound();

  const filePath = path.join(process.cwd(), "content/tutorials", `${slug}.md`);
  if (!fs.existsSync(filePath)) notFound();

  const content = fs.readFileSync(filePath, "utf-8");

  const currentIndex = tutorialsData.findIndex((t) => t.slug === slug);
  const prev = currentIndex > 0 ? tutorialsData[currentIndex - 1] : null;
  const next =
    currentIndex < tutorialsData.length - 1
      ? tutorialsData[currentIndex + 1]
      : null;

  return (
    <div className="relative h-full w-full">
      <GrainientBackground />

      {/* Scrollable content */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-10">
          {/* Back */}
          <Link
            href="/app/tutorials"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-white/60 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            All Tutorials
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-white">
                {meta.difficulty}
              </span>
              <span className="flex items-center gap-1 text-[12px] text-white/50">
                <Clock size={12} />
                {meta.readTime}
              </span>
            </div>
            <h1 className="text-[32px] font-bold text-white leading-tight mb-2">
              {meta.title}
            </h1>
            <p className="text-[16px] text-white/65 leading-relaxed">
              {meta.description}
            </p>
          </div>

          {/* Markdown content */}
          <div className="bg-white/10 backdrop-blur-sm rounded-[16px] border border-white/20 p-7">
            <ReactMarkdown
              components={{
                h1: () => null,
                h2: ({ children }) => (
                  <h2 className="text-[18px] font-bold text-white mt-8 mb-3 pb-2 border-b border-white/20 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-[15px] font-semibold text-white mt-5 mb-2">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-[15px] text-white/75 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-white">
                    {children}
                  </strong>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 flex flex-col gap-1.5">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 flex flex-col gap-1.5 list-none pl-0">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="flex gap-2 text-[15px] text-white/75 leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                    <span>{children}</span>
                  </li>
                ),
                hr: () => <hr className="border-white/15 my-6" />,
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-[14px] border-collapse">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="text-left px-3 py-2 bg-white/15 text-white font-semibold border border-white/15">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 border border-white/15 text-white/70">
                    {children}
                  </td>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[var(--color-accent)] pl-4 my-4 text-white/60 italic">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* Prev / Next navigation */}
          <div className="flex items-center justify-between gap-4 mt-8">
            {prev ? (
              <Link
                href={`/app/tutorials/${prev.slug}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-white/10 border border-white/20 hover:bg-white/15 transition-all text-[13px] font-medium text-white"
              >
                <ArrowLeft size={14} />
                {prev.title}
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/app/tutorials/${next.slug}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-[var(--color-accent)] text-[var(--color-deep)] text-[13px] font-semibold hover:bg-white transition-colors ml-auto"
              >
                {next.title}
                <GraduationCap size={14} />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
