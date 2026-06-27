// @ts-nocheck
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
        <section id="grades" className="bg-white/75 backdrop-blur-sm px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="text-center">
                    <div className="mb-3 inline-flex items-center  gap-2 rounded-full border border-[#D9EAF2] bg-gold-300 px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm">
                        <GraduationCap size={16} />
                        اختر صفك
                    </div>

                    <h2 className="text-3xl font-black text-[#0B2B3F] sm:text-4xl">
                        اختر صفك الدراسي
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-[#587083]">
                        كل صف له مسار واضح من الشرح والتدريبات إلى الاختبارات والمراجعة.
                    </p>
                </div>

                <div className="mt-10 grid gap-5 md:grid-cols-4">
                    {grades.map((grade, index) => (
                        <article
                            key={grade.title}
                            className="group relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-[#F7FBFF] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0B5F7A]/10"
                        >
                            <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[#F5D58A]/20" />

                            <span
                                className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg"
                                style={{ backgroundColor: grade.color }}
                            >
                                {index + 1}
                            </span>

                            <h3 className="mt-6 text-xl font-black text-[#0B2B3F]">
                                {grade.title}
                            </h3>

                            <p className="mt-3 text-sm font-bold text-[#0B6F7A]">
                                {grade.summary}
                            </p>
                            <Link
                                to="/subjects"
                                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#0B2B3F] shadow-sm transition group-hover:bg-[#075B78] group-hover:text-white"
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