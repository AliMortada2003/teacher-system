import { ArrowLeft, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const grades = [
    {
        title: "الصف الأول الثانوي",
        summary: "شرح + تدريبات + اختبارات",
        description: "تأسيس قوي في النحو والقراءة والنصوص مع تدريبات منظمة.",
        color: "#075B78",
    },
    {
        title: "الصف الثاني الثانوي",
        summary: "شرح + تدريبات + متابعة",
        description: "شرح البلاغة والأدب والنحو والنصوص بطريقة مبسطة.",
        color: "#C39135",
    },
    {
        title: "الصف الثالث الثانوي",
        summary: "مراجعات + امتحانات + بنك أسئلة",
        description: "مراجعات وتدريبات امتحانية شاملة لطلاب الثانوية العامة.",
        color: "#0B6F7A",
    },
];

export function HomeGradeTracks() {
    return (
        <section
            id="grades"
            className="relative bg-white/75 px-4 py-16 backdrop-blur-sm transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950/45"
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#DCEAF3] to-transparent dark:via-white/10" />
            <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#E8F8FA]/70 blur-3xl dark:bg-cyan-400/10" />
            <div className="pointer-events-none absolute -left-24 bottom-12 h-72 w-72 rounded-full bg-[#FFF5DF]/80 blur-3xl dark:bg-yellow-300/10" />

            <div className="relative mx-auto max-w-7xl">
                <div className="text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-gold-300 px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm transition-colors dark:border-yellow-300/20 dark:bg-yellow-300/15 dark:text-yellow-300">
                        <GraduationCap size={16} />
                        اختر صفك
                    </div>

                    <h2 className="text-3xl font-black text-[#0B2B3F] transition-colors sm:text-4xl dark:text-slate-50">
                        اختر صفك الدراسي
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-[#587083] transition-colors dark:text-slate-300">
                        كل صف له مسار واضح من الشرح والتدريبات إلى الاختبارات والمراجعة.
                    </p>
                </div>

                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {grades.map((grade, index) => (
                        <article
                            key={grade.title}
                            className="group relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-[#F7FBFF] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0B5F7A]/10 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-none dark:hover:border-cyan-400/40"
                        >
                            <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[#F5D58A]/20 transition-colors dark:bg-yellow-300/10" />
                            <div className="pointer-events-none absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-[#BEE8F4]/20 blur-2xl transition-colors dark:bg-cyan-400/10" />

                            <span
                                className="relative flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                                style={{ backgroundColor: grade.color }}
                            >
                                {index + 1}
                            </span>

                            <h3 className="relative mt-6 text-xl font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                                {grade.title}
                            </h3>

                            <p className="relative mt-3 text-sm font-bold text-[#0B6F7A] transition-colors dark:text-cyan-300">
                                {grade.summary}
                            </p>

                            <p className="relative mt-3 min-h-[56px] text-sm font-medium leading-7 text-[#587083] transition-colors dark:text-slate-400">
                                {grade.description}
                            </p>

                            <Link
                                to="/subjects"
                                className="relative mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#0B2B3F] shadow-sm transition duration-300 group-hover:bg-[#075B78] group-hover:text-white dark:bg-slate-800 dark:text-slate-100 dark:shadow-none dark:group-hover:bg-cyan-500 dark:group-hover:text-slate-950"
                            >
                                عرض التفاصيل
                                <ArrowLeft size={16} />
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}