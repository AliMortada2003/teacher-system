import { useState } from "react";
import {
    ArrowLeft,
    Award,
    BookOpenCheck,
    CheckCircle2,
    CloudDownload,
    GraduationCap,
    LineChart,
    PlayCircle,
    ShieldCheck,
    Sparkles,
    Star,
    UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const aboutStats = [
    {
        value: "+120",
        label: "درس منظم",
        icon: BookOpenCheck,
    },
    {
        value: "+35",
        label: "اختبار وتدريب",
        icon: LineChart,
    },
    {
        value: "+500",
        label: "طالب مستفيد",
        icon: UsersRound,
    },
];

const features = [
    {
        title: "شرح مبسط ومنظم",
        description: "الدروس متقسمة بطريقة سهلة تساعد الطالب يفهم خطوة بخطوة بدون تشتت.",
        icon: BookOpenCheck,
        color: "#0B6F7A",
        soft: "#E8F8FA",
    },
    {
        title: "اختبارات ومتابعة",
        description: "بعد كل جزء يقدر الطالب يختبر نفسه ويعرف مستواه ونقاط الضعف.",
        icon: LineChart,
        color: "#C39135",
        soft: "#FFF5DF",
    },
    {
        title: "ملفات ومراجعات",
        description: "مذكرات، أوراق عمل، ومراجعات نهائية قابلة للتحميل داخل الدروس.",
        icon: CloudDownload,
        color: "#4F46E5",
        soft: "#EEF2FF",
    },
    {
        title: "تجربة آمنة وهادئة",
        description: "منصة تعليمية واضحة وسهلة الاستخدام للطالب وولي الأمر.",
        icon: ShieldCheck,
        color: "#16A34A",
        soft: "#ECFDF3",
    },
];

export default function About() {
    return (
        <div className="min-h-screen bg-[#F6FAFB]">
            <section className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#E8F8FA] blur-3xl" />
                <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#FFF5DF] blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="text-center lg:text-right">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-white px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm">
                            <Sparkles size={16} />
                            عن منصة الأوائل
                        </div>

                        <h1 className="text-4xl font-black leading-tight text-[#0B2B3F] sm:text-5xl lg:text-6xl">
                            منصة تعليمية متكاملة لتعلّم{" "}
                            <span className="text-[#C39135]">اللغة العربية</span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-9 text-[#41596B] lg:mx-0">
                            منصة الأوائل صُممت خصيصًا لطلاب المرحلة الثانوية، لتقديم شرح
                            مبسط ومنظم في اللغة العربية مع تدريبات، اختبارات، مراجعات،
                            وملفات تساعد الطالب يذاكر بثقة ويتابع مستواه باستمرار.
                        </p>

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                            <Link
                                to="/subjects"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#075B78] px-7 py-4 text-sm font-black text-white shadow-xl shadow-[#075B78]/20 transition hover:-translate-y-0.5 hover:bg-[#064B64]"
                            >
                                تصفح الكورسات
                                <ArrowLeft size={18} />
                            </Link>

                            <Link
                                to="/#intro"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C9DDE9] bg-white px-7 py-4 text-sm font-black text-[#0B2B3F] shadow-sm transition hover:-translate-y-0.5 hover:border-[#0B6F7A] hover:text-[#0B6F7A]"
                            >
                                <PlayCircle size={19} />
                                شاهد الدرس التعريفي
                            </Link>
                        </div>
                    </div>

                    <TeacherCard />
                </div>
            </section>

            <section className="px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-3">
                    {aboutStats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <article
                                key={stat.label}
                                className="rounded-[2rem] border border-[#DCEAF3] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0B5F7A]/10"
                            >
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F8FA] text-[#0B6F7A]">
                                    <Icon size={25} />
                                </div>

                                <p className="mt-4 text-3xl font-black text-[#0B2B3F]">
                                    {stat.value}
                                </p>

                                <p className="mt-1 text-sm font-bold text-[#6B8293]">
                                    {stat.label}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="px-4 pb-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 text-center">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-white px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm">
                            <GraduationCap size={16} />
                            لماذا منصة الأوائل؟
                        </div>

                        <h2 className="text-3xl font-black text-[#0B2B3F] sm:text-4xl">
                            كل ما يحتاجه الطالب في مكان واحد
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-[#587083]">
                            تجربة تعليمية منظمة تساعد الطالب يفهم، يراجع، يتدرب،
                            ويقيس مستواه بسهولة.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <article
                                    key={feature.title}
                                    className="group relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-white hover:shadow-2xl hover:shadow-[#0B5F7A]/10"
                                >
                                    <div
                                        className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full blur-2xl transition group-hover:scale-125"
                                        style={{ backgroundColor: feature.soft }}
                                    />

                                    <div className="relative">
                                        <div
                                            className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
                                            style={{
                                                backgroundColor: feature.soft,
                                                color: feature.color,
                                            }}
                                        >
                                            <Icon size={25} />
                                        </div>

                                        <h3 className="text-lg font-black text-[#0B2B3F]">
                                            {feature.title}
                                        </h3>

                                        <p className="mt-3 text-sm font-medium leading-7 text-[#587083]">
                                            {feature.description}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="px-4 pb-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-[#DCEAF3] bg-[#075B78] p-8 shadow-2xl shadow-[#075B78]/15 sm:p-10">
                    <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-right">
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-[#FFF5DF]">
                                <CheckCircle2 size={16} />
                                ابدأ رحلتك التعليمية الآن
                            </p>

                            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                                اختر صفك وابدأ التعلم بطريقة منظمة
                            </h2>

                            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-white/75">
                                دروس، اختبارات، مراجعات، وملفات تحميل تساعدك تذاكر
                                بثقة وتتابع تقدمك خطوة بخطوة.
                            </p>
                        </div>

                        <Link
                            to="/grades"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-black text-[#075B78] shadow-xl transition hover:-translate-y-0.5"
                        >
                            اختر الصف الدراسي
                            <ArrowLeft size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function TeacherCard() {
    const [imageError, setImageError] = useState(false);
    const teacherImage = "/images/heroImage.png";

    return (
        <div className="relative mx-auto w-full max-w-md">
            <div className="pointer-events-none absolute -inset-5 rounded-[3rem] border border-dashed border-[#C39135]/40 animate-[spin_22s_linear_infinite]" />

            <div className="absolute -right-4 top-12 z-20 hidden rounded-2xl border border-[#DCEAF3] bg-white px-4 py-3 shadow-xl shadow-[#0B5F7A]/10 sm:block">
                <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDF8EC] text-[#C39135]">
                        <Award size={18} />
                    </span>

                    <div>
                        <p className="text-xs font-black text-[#0B2B3F]">خبرة تعليمية</p>
                        <p className="text-[11px] font-bold text-[#6B8293]">شرح مبسط ومنظم</p>
                    </div>
                </div>
            </div>

            <div className="absolute -left-4 bottom-16 z-20 hidden rounded-2xl border border-[#DCEAF3] bg-white px-4 py-3 shadow-xl shadow-[#0B5F7A]/10 sm:block">
                <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8FA] text-[#0B6F7A]">
                        <Star size={18} fill="currentColor" />
                    </span>

                    <div>
                        <p className="text-xs font-black text-[#0B2B3F]">تقييم مميز</p>
                        <p className="text-[11px] font-bold text-[#6B8293]">طلاب المرحلة الثانوية</p>
                    </div>
                </div>
            </div>

            <div className="relative animate-[hero-float_6s_ease-in-out_infinite] rounded-[2.7rem] border border-[#DCEAF3] bg-white/70 p-4 shadow-2xl shadow-[#0B5F7A]/10 backdrop-blur-xl">
                <div className="overflow-hidden rounded-[2.2rem] bg-gradient-to-b from-[#EAF7FC] via-white to-[#FFF8E9] p-5">
                    <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white bg-[#DDEFF7] shadow-2xl shadow-[#0B5F7A]/15 sm:h-[430px]">
                        {!imageError ? (
                            <img
                                src={teacherImage}
                                alt="أ. أحمد المسعود"
                                onError={() => setImageError(true)}
                                className="h-full w-full object-cover object-top"
                            />
                        ) : (
                            <div className="flex h-full min-h-[360px] w-full items-center justify-center bg-gradient-to-b from-[#075B78] to-[#0B2B3F]">
                                <span className="text-7xl font-black text-white">أ</span>
                            </div>
                        )}

                        <div className="absolute inset-x-4 bottom-3 rounded-[2rem] bg-white/35 p-4 text-center shadow-2xl backdrop-blur-md">
                            <h3 className="text-xl font-black text-[#0B2B3F]">
                                أ. أحمد المسعود
                            </h3>

                            <p className="mt-1 text-sm font-black text-[#C39135]">
                                مدرس اللغة العربية للمرحلة الثانوية
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}