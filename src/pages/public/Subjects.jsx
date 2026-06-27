import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpenCheck,
  Search,
  Star,
  UsersRound,
} from "lucide-react";

import { db } from "../../db/database.js";
import { EmptyState } from "../../components/ui/EmptyState.jsx";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const subs = db.all("subjects");
    const lessons = db.all("lessons");
    const users = db.all("users");

    setSubjects(
      subs
        .filter((subject) => subject.published !== false)
        .map((subject) => ({
          ...subject,
          lessonsCount: lessons.filter(
            (lesson) => lesson.subjectId === subject.id
          ).length,
          studentsCount: users.filter(
            (user) =>
              user.role === "student" &&
              user.subjectIds?.includes(subject.id)
          ).length,
        }))
    );
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return subjects;

    return subjects.filter((subject) => {
      const name = String(subject.name || "").toLowerCase();
      const code = String(subject.code || "").toLowerCase();

      return name.includes(normalizedQuery) || code.includes(normalizedQuery);
    });
  }, [subjects, query]);

  return (
    <div className="min-h-screen bg-[#F6FAFB] transition-colors duration-300 dark:bg-[#0B1220]">
      <section className="relative overflow-hidden bg-white px-4 py-16 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950">
        <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-[#E8F8FA] blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#FFF5DF] blur-3xl dark:bg-yellow-300/10" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-white px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm transition-colors dark:border-yellow-300/20 dark:bg-yellow-300/15 dark:text-yellow-300 dark:shadow-none">
              <BookOpenCheck size={16} />
              الكورسات المتاحة
            </div>

            <h1 className="text-3xl font-black text-[#0B2B3F] transition-colors md:text-5xl dark:text-slate-50">
              اختر مسارك التعليمي
            </h1>

            <p className="mt-4 text-base font-medium leading-8 text-[#587083] transition-colors dark:text-slate-300">
              كورسات منظمة من مدرس واحد، مصممة للدراسة الهادئة والمتابعة
              المستمرة مع دروس، تدريبات، واختبارات.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7B93A5] transition-colors dark:text-slate-400"
              size={19}
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث عن كورس..."
              className="h-14 w-full rounded-2xl border border-[#D6E4EE] bg-white pr-12 pl-4 text-sm font-bold text-[#0B2B3F] shadow-sm outline-none transition placeholder:text-[#8AA0B1] focus:border-[#0B6F7A] focus:ring-4 focus:ring-[#0B6F7A]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:shadow-none dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {filtered.length === 0 ? (
            <div className="rounded-[2rem] border border-[#DCEAF3] bg-white p-8 transition-colors dark:border-slate-700 dark:bg-slate-900/85">
              <EmptyState
                title="لا توجد كورسات مطابقة"
                description="جرّب كلمة بحث مختلفة أو تصفح كل الكورسات المتاحة."
              />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((subject) => (
                <SubjectCourseCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SubjectCourseCard({ subject }) {
  const imageSrc =
    subject.imageUrl ||
    subject.coverImageUrl ||
    subject.thumbnailUrl ||
    subject.image ||
    subject.bannerUrl ||
    "https://quranteacheracademy.com/wp-content/uploads/2024/04/%D8%AF%D9%88%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D9%84%D8%BA%D8%A9-%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9.jpg";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-white hover:shadow-2xl hover:shadow-[#0B5F7A]/10 dark:border-slate-700 dark:bg-slate-900/85 dark:shadow-none dark:hover:border-cyan-400/40 dark:hover:shadow-none">
      <div className="relative h-52 overflow-hidden bg-[#EFF7FA] transition-colors dark:bg-slate-800">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={subject.name || "صورة الكورس"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(11,111,122,0.24),transparent_35%),linear-gradient(135deg,#F3FAFC,#EAF5F8)] dark:bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_35%),linear-gradient(135deg,#111827,#0F172A)]">
            <BookOpenCheck
              size={54}
              className="text-[#0B6F7A] dark:text-cyan-300"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#071F2F]/65 via-[#071F2F]/10 to-transparent dark:from-black/75 dark:via-black/10" />

        <span className="absolute bottom-4 right-4 rounded-full bg-white/95 px-4 py-2 text-xs font-black text-[#0B6F7A] shadow-sm backdrop-blur-sm transition-colors dark:bg-slate-950/85 dark:text-cyan-300">
          {subject.level || subject.grade || "منهج كامل"}
        </span>

        <span className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-2 text-sm font-black text-[#C39135] shadow-sm backdrop-blur-sm transition-colors dark:bg-slate-950/85 dark:text-yellow-300">
          <Star size={15} fill="currentColor" />
          {subject.rating || "5.0"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#FDF8EC] px-3 py-1 text-[11px] font-black text-[#A67318] transition-colors dark:bg-yellow-300/15 dark:text-yellow-300">
            {subject.code || "كورس"}
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-black text-[#6B8293] transition-colors dark:text-slate-400">
            <UsersRound size={14} />
            {subject.studentsCount || 0} طالب
          </span>
        </div>

        <h3 className="line-clamp-2 text-xl font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
          {subject.name}
        </h3>

        <p className="mt-3 min-h-[84px] text-sm font-medium leading-7 text-[#587083] line-clamp-3 transition-colors dark:text-slate-400">
          {subject.description ||
            "كورس منظم يساعدك على فهم المنهج خطوة بخطوة مع تدريبات ومراجعات مستمرة."}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-[#F7FBFF] p-3 text-center transition-colors dark:bg-slate-800/80">
          <CourseMiniStat value={subject.lessonsCount || 0} label="درس" />
          <CourseMiniStat value={subject.quizzesCount || 0} label="اختبار" />
          <CourseMiniStat value={subject.studentsCount || 0} label="طالب" />
        </div>

        <Link
          to={`/subjects/${subject.id}`}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#075B78] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#075B78]/15 transition hover:bg-[#064B64] dark:bg-cyan-500 dark:text-slate-950 dark:shadow-none dark:hover:bg-cyan-400"
        >
          عرض الكورس
          <ArrowLeft size={16} />
        </Link>
      </div>
    </article>
  );
}

function CourseMiniStat({ value, label }) {
  return (
    <div>
      <p className="text-base font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
        {value}
      </p>
      <p className="mt-1 text-[11px] font-bold text-[#6B8293] transition-colors dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}