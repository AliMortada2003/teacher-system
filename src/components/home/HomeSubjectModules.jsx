import { BookOpen, BookOpenCheck, FileText, PenLine, Sparkles, Star } from "lucide-react";

const modules = [
    { title: "النحو", icon: BookOpen },
    { title: "البلاغة", icon: Sparkles },
    { title: "النصوص", icon: FileText },
    { title: "القراءة", icon: BookOpenCheck },
    { title: "التعبير", icon: PenLine },
    { title: "المراجعات", icon: Star },
];

export function HomeSubjectModules() {
    return (
        <section id="subjects" className="bg-white/75 backdrop-blur-sm px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-white px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm">
                        <BookOpen size={16} />
                        أقسام العربي
                    </div>

                    <h2 className="text-3xl font-black text-[#0B2B3F] sm:text-4xl">
                        ماذا ستتعلم؟
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-[#587083]">
                        محتوى منظم يغطي أجزاء اللغة العربية الأساسية للمرحلة الثانوية.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {modules.map((module) => {
                        const Icon = module.icon;

                        return (
                            <div
                                key={module.title}
                                className="group rounded-[2rem] border border-[#DCEAF3] bg-[#F7FBFF] p-5 text-center transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-[#0B5F7A]/10"
                            >
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0B6F7A] shadow-sm group-hover:bg-[#0B6F7A] group-hover:text-white">
                                    <Icon size={23} />
                                </div>

                                <p className="mt-4 text-sm font-black text-[#0B2B3F]">
                                    {module.title}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}