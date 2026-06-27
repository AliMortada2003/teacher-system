import {
    ClipboardCheck,
    CloudDownload,
    Download,
    FileText,
    PenLine,
} from "lucide-react";

const resources = [
    {
        title: "ملفات PDF",
        description: "ملخصات وشروحات منظمة قابلة للتحميل في أي وقت.",
        icon: FileText,
        accent: "#0B6F7A",
        soft: "#E8F8FA",
        glow: "rgba(11,111,122,0.16)",
        tag: "ملخصات منظمة",
    },
    {
        title: "أوراق عمل",
        description: "تدريبات تطبيقية بعد كل درس لتثبيت الفهم.",
        icon: PenLine,
        accent: "#C39135",
        soft: "#FFF5DF",
        glow: "rgba(195,145,53,0.20)",
        tag: "تدريب عملي",
    },
    {
        title: "مراجعات نهائية",
        description: "مراجعات مركزة قبل الاختبارات بأهم النقاط.",
        icon: Download,
        accent: "#4F46E5",
        soft: "#EEF2FF",
        glow: "rgba(79,70,229,0.16)",
        tag: "قبل الامتحان",
    },
    {
        title: "بنك أسئلة",
        description: "أسئلة متنوعة على أجزاء المنهج مع مستوى متدرج.",
        icon: ClipboardCheck,
        accent: "#16A34A",
        soft: "#ECFDF3",
        glow: "rgba(22,163,74,0.16)",
        tag: "تقييم مستمر",
    },
];

export function HomeResources() {
    return (
        <section className="relative overflow-hidden bg-white/75 px-4 py-20 backdrop-blur-sm transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950/45">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#DCEAF3] to-transparent dark:via-white/10" />
            <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#E8F8FA] blur-3xl dark:bg-cyan-400/10" />
            <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#FFF5DF] blur-3xl dark:bg-yellow-300/10" />

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-gold-300 px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm transition-colors dark:border-yellow-300/20 dark:bg-yellow-300/15 dark:text-yellow-300">
                            <CloudDownload size={16} />
                            ملفات ومذكرات
                        </div>

                        <h2 className="text-3xl font-black text-[#0B2B3F] transition-colors sm:text-4xl dark:text-slate-50">
                            دروس وموارد قابلة للتحميل
                        </h2>

                        <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-[#587083] transition-colors dark:text-slate-300">
                            كل درس يمكن دعمه بملفات مراجعة وتدريبات تساعد الطالب يرجع
                            للمعلومة في أي وقت بطريقة سهلة ومنظمة.
                        </p>
                    </div>

                    <div className="hidden rounded-[2rem] border border-[#DCEAF3] bg-white px-5 py-4 shadow-sm transition-colors lg:block dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-none">
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-sm font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                                    محتوى منظم لكل درس
                                </p>
                                <p className="mt-1 text-xs font-bold text-[#6B8293] transition-colors dark:text-slate-400">
                                    تحميل، مراجعة، تدريب، وأسئلة
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
                    {resources.map((resource) => {
                        const Icon = resource.icon;

                        return (
                            <article
                                key={resource.title}
                                className="group relative overflow-hidden rounded-[2.25rem] border border-[#DCEAF3] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-white hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/85 dark:shadow-none dark:hover:border-cyan-400/40 dark:hover:shadow-none"
                                style={{
                                    boxShadow: `0 18px 55px ${resource.glow}`,
                                }}
                            >
                                <div
                                    className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full blur-2xl transition duration-500 group-hover:scale-125 dark:opacity-20"
                                    style={{ backgroundColor: resource.soft }}
                                />

                                <div className="pointer-events-none absolute -right-12 bottom-0 h-32 w-32 rounded-full bg-[#E8F8FA]/40 blur-2xl transition-colors dark:bg-cyan-400/10" />

                                <div className="relative">
                                    <div className="flex items-start justify-between gap-3">
                                        <div
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1.35rem] shadow-sm ring-8 ring-white transition-colors dark:ring-slate-900"
                                            style={{
                                                backgroundColor: resource.soft,
                                                color: resource.accent,
                                            }}
                                        >
                                            <Icon size={20} strokeWidth={2.1} />
                                        </div>

                                        <span
                                            className="rounded-full px-2 py-1.5 text-center text-[11px] font-black"
                                            style={{
                                                backgroundColor: resource.soft,
                                                color: resource.accent,
                                            }}
                                        >
                                            {resource.tag}
                                        </span>
                                    </div>

                                    <h3 className="mt-7 text-lg font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                                        {resource.title}
                                    </h3>

                                    <p className="mt-3 text-sm font-medium leading-7 text-[#587083] transition-colors dark:text-slate-400">
                                        {resource.description}
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}