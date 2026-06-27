import { CheckCircle2, Sparkles } from "lucide-react";

const highlights = [
    "تبسيط النحو والبلاغة",
    "تدريبات بعد كل درس",
    "اختبارات إلكترونية",
    "مراجعات للثانوية العامة",
];

export function HomeAboutTeacher() {
    return (
        <section
            id="intro"
            className="relative overflow-hidden bg-transparent px-4 py-16 sm:px-6 lg:px-8"
        >
            <div className="pointer-events-none absolute -left-20 top-20 h-80 w-80 rounded-full bg-[#F5D58A]/20 blur-3xl" />

            <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div className="rounded-[2rem] border border-[#DCEAF3] bg-white p-6 shadow-xl shadow-[#0B5F7A]/10">
                    <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[#075B78] text-3xl font-black text-white shadow-lg shadow-[#075B78]/20">
                            أ
                        </div>

                        <div>
                            <h3 className="text-2xl font-black text-[#0B2B3F]">
                                أ. أحمد المسعود
                            </h3>

                            <p className="mt-2 text-sm font-black text-[#C39135]">
                                مدرس اللغة العربية للمرحلة الثانوية
                            </p>
                        </div>
                    </div>

                    <p className="mt-6 text-sm font-medium leading-8 text-[#587083]">
                        مدرس لغة عربية متخصص في تبسيط النحو والبلاغة والنصوص لطلاب المرحلة
                        الثانوية بخطة منظمة لكل صف.
                    </p>

                    <div className="mt-6 grid gap-3">
                        {highlights.map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-3 rounded-2xl bg-[#F7FBFF] px-4 py-3"
                            >
                                <CheckCircle2 className="text-[#0B6F7A]" size={19} />
                                <span className="text-sm font-black text-[#0B2B3F]">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-white px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm">
                        <Sparkles size={16} />
                        عن المنصة
                    </div>

                    <h2 className="text-3xl font-black leading-tight text-[#0B2B3F] sm:text-4xl">
                        تعلم عربي بطريقة واضحة ومريحة
                    </h2>

                    <p className="mt-5 text-base font-medium leading-9 text-[#587083]">
                        منصة تعليمية متخصصة في اللغة العربية للمرحلة الثانوية، تجمع بين
                        الشرح المنظم، التدريبات، الاختبارات، ومتابعة التقدم.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {[
                            "خطة واضحة لكل صف",
                            "شرح مبسط بدون تعقيد",
                            "اختبارات ومتابعة مستوى",
                            "ملفات منظمة للمراجعة",
                        ].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-[#DCEAF3] bg-white px-5 py-4 text-sm font-black text-[#0B2B3F] shadow-sm"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}