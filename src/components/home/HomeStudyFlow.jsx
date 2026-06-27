import { BarChart3, BookOpenCheck, ClipboardCheck, Layers3, PenLine } from "lucide-react";

const items = [
    {
        title: "دروس منظمة",
        description: "كل درس مرتب داخل مسار واضح حسب الصف الدراسي.",
        icon: BookOpenCheck,
    },
    {
        title: "تدريبات بعد كل درس",
        description: "أسئلة قصيرة تساعد الطالب يثبت المعلومة بسرعة.",
        icon: PenLine,
    },
    {
        title: "اختبارات إلكترونية",
        description: "امتحانات تقيس المستوى وتوضح نقاط القوة والضعف.",
        icon: ClipboardCheck,
    },
    {
        title: "متابعة التقدم",
        description: "نتائج وتقدم محفوظين داخل حساب الطالب طوال الوقت.",
        icon: BarChart3,
    },
];

export function HomeStudyFlow() {
    return (
        <section className="bg-transparent px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-white px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm">
                        <Layers3 size={16} />
                        نظام الدراسة
                    </div>

                    <h2 className="text-3xl font-black text-[#0B2B3F] sm:text-4xl">
                        كيف تتم الدراسة؟
                    </h2>

                    <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-[#587083]">
                        تجربة تعليمية منظمة تساعد الطالب يمشي خطوة بخطوة من الدرس إلى
                        التدريب ثم الاختبار والمتابعة.
                    </p>
                </div>

                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {items.map((item) => {
                        const Icon = item.icon;

                        return (
                            <article
                                key={item.title}
                                className="rounded-[2rem] border border-[#DCEAF3] bg-white p-6 shadow-sm"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E9F6F9] text-[#0B6F7A]">
                                    <Icon size={24} />
                                </div>

                                <h3 className="mt-5 text-lg font-black text-[#0B2B3F]">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-sm font-medium leading-7 text-[#587083]">
                                    {item.description}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}