import {
    ArrowLeft,
    BookOpenCheck,
    GraduationCap,
    Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const grades = [
    {
        id: "first-secondary",
        title: "الصف الأول الثانوي",
        subtitle: "بداية قوية في اللغة العربية",
        description:
            "شرح منظم لأساسيات النحو والقراءة والنصوص مع تدريبات تساعد الطالب يبدأ بثقة.",
        label: "أولى ثانوي",
        color: "#0B6F7A",
        soft: "#E8F8FA",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyQ6QiUsl0va_hQvqmxBzabQehaUIwkIF7e1J-gghdzyZ2hPNkO9LW1rN5&s=10",
    },
    {
        id: "second-secondary",
        title: "الصف الثاني الثانوي",
        subtitle: "تأسيس ومتابعة أقوى",
        description:
            "دروس مرتبة ومراجعات مستمرة تساعد الطالب يثبت مستواه ويستعد للمرحلة القادمة.",
        label: "تانية ثانوي",
        color: "#C39135",
        soft: "#FFF5DF",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuHhk9mL0ot2pFYStg44GbM41WSzsOMrc516Y63b61RQ&s=10",
    },
    {
        id: "third-secondary",
        title: "الصف الثالث الثانوي",
        subtitle: "استعداد كامل للامتحان",
        description:
            "شرح مركز، مراجعات نهائية، اختبارات، وبنك أسئلة يساعد الطالب يعرف مستواه باستمرار.",
        label: "تالتة ثانوي",
        color: "#4F46E5",
        soft: "#EEF2FF",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsJ74bGYTHIVKb-nZrsgRelo-gFbVtomfCU_LS01Avul2YPHmV_-M-IaQ&s=10",
    },
];

export default function Grades() {
    return (
        <div className="min-h-screen bg-[#F6FAFB] transition-colors duration-300 dark:bg-[#0B1220]">
            <section className="relative overflow-hidden bg-white px-4 py-16 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950">
                <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#E8F8FA] blur-3xl dark:bg-cyan-400/10" />
                <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#FFF5DF] blur-3xl dark:bg-yellow-300/10" />

                <div className="relative mx-auto max-w-7xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-white px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm transition-colors dark:border-yellow-300/20 dark:bg-yellow-300/15 dark:text-yellow-300 dark:shadow-none">
                        <GraduationCap size={16} />
                        الصفوف الدراسية
                    </div>

                    <h1 className="text-3xl font-black text-[#0B2B3F] transition-colors sm:text-5xl dark:text-slate-50">
                        اختر الصف الدراسي المناسب
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-[#587083] transition-colors dark:text-slate-300">
                        اختار صفك وابدأ في متابعة الدروس، الاختبارات، والمراجعات الخاصة
                        بمنهج اللغة العربية للمرحلة الثانوية.
                    </p>
                </div>
            </section>

            <section className="px-4 py-14 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
                    {grades.map((grade) => (
                        <GradeCard key={grade.id} grade={grade} />
                    ))}
                </div>
            </section>
        </div>
    );
}

function GradeCard({ grade }) {
    return (
        <article className="group relative flex min-h-[480px] flex-col overflow-hidden rounded-[2.25rem] border border-[#DCEAF3] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-white hover:shadow-2xl hover:shadow-[#0B5F7A]/10 dark:border-slate-700 dark:bg-slate-900/85 dark:shadow-none dark:hover:border-cyan-400/40 dark:hover:shadow-none">
            <div
                className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full blur-2xl transition duration-500 group-hover:scale-125 dark:opacity-20"
                style={{ backgroundColor: grade.soft }}
            />

            <div
                className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 rounded-tl-full opacity-70 dark:opacity-15"
                style={{ backgroundColor: grade.soft }}
            />

            <div className="relative flex flex-1 flex-col p-6">
                <div className="mb-5 flex items-center justify-between">
                    <span
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black"
                        style={{
                            backgroundColor: grade.soft,
                            color: grade.color,
                        }}
                    >
                        {grade.label}
                    </span>

                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FDF8EC] text-[#C39135] shadow-sm transition-colors dark:bg-yellow-300/15 dark:text-yellow-300 dark:shadow-none">
                        <Star size={18} fill="currentColor" />
                    </span>
                </div>

                <div
                    className="mb-6 flex h-48 items-center justify-center overflow-hidden rounded-[1.75rem] transition-colors dark:bg-slate-800"
                    style={{ backgroundColor: grade.soft }}
                >
                    {grade.image ? (
                        <img
                            src={grade.image}
                            alt={grade.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <BookOpenCheck size={64} style={{ color: grade.color }} />
                    )}
                </div>

                <h2 className="text-2xl font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                    {grade.title}
                </h2>

                <p
                    className="mt-2 text-sm font-black "
                    style={{ color: grade.color }}
                >
                    {grade.subtitle}
                </p>

                <p className="mt-4 min-h-[84px] text-sm font-medium leading-7 text-[#587083] transition-colors dark:text-slate-400">
                    {grade.description}
                </p>

                <Link
                    to={`/subjects?grade=${grade.id}`}
                    className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 dark:text-white dark:shadow-none"
                    style={{
                        backgroundColor: grade.color,
                        boxShadow: `0 16px 35px ${grade.color}25`,
                    }}
                >
                    عرض الكورسات
                    <ArrowLeft size={16} />
                </Link>
            </div>
        </article>
    );
}