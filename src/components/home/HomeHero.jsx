import { useState } from "react";
import {
    ArrowLeft,
    Award,
    BookOpen,
    CheckCircle2,
    CloudDownload,
    FileText,
    LineChart,
    PlayCircle,
    Sparkles,
    Star,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const heroFeatures = [
    {
        title: "شرح عربي للثانوي",
        icon: BookOpen,
    },
    {
        title: "اختبارات ومتابعة تقدم",
        icon: LineChart,
    },
    {
        title: "دروس وموارد مدى الحياة",
        icon: CloudDownload,
    },
];

export function HomeHero() {
    return (
        <section className="relative overflow-hidden bg-transparent">
            <div className="pointer-events-none absolute -right-28 top-10 h-80 w-80 rounded-full bg-[#E8F8FA] blur-3xl" />
            <div className="pointer-events-none absolute -left-28 bottom-10 h-80 w-80 rounded-full bg-[#FFF5DF] blur-3xl" />

            <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
                <div className="order-2 flex flex-col justify-center text-center lg:order-1 lg:col-start-1 lg:text-right">
                    <h1 className="text-4xl font-black leading-tight text-[#0B2B3F] sm:text-5xl lg:text-6xl">
                        أ. أحمد المسعود
                    </h1>

                    <h2 className="mt-4 text-2xl font-black text-[#C39135] sm:text-3xl">
                        مدرس اللغة العربية للمرحلة الثانوية
                    </h2>

                    <div className="mx-auto mt-6 min-h-[108px] max-w-2xl text-base font-medium leading-9 text-[#41596B] lg:mx-0">
                        <TypeAnimation
                            sequence={[
                                "تبسيط النحو والبلاغة والنصوص بطريقة منظمة وسهلة.",
                                1600,
                                "خطة واضحة لكل صف مع اختبارات ومتابعة مستمرة لمستوى الطالب.",
                                1600,
                                "دروس، مراجعات، وملفات تحميل تساعدك تذاكر بثقة في أي وقت.",
                                1600,
                            ]}
                            wrapper="p"
                            speed={65}
                            deletionSpeed={45}
                            repeat={Infinity}
                            cursor
                        />
                    </div>

                    <div className="flex  justify-start gap-3 animate-fade-up">
                        <Link
                            to="/subjects"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#075B78] px-7 py-4 text-sm font-black text-white shadow-xl shadow-[#075B78]/20 transition hover:-translate-y-0.5 hover:bg-[#064B64]"
                        >
                            ابدأ
                            <ArrowLeft size={18} />
                        </Link>

                        <Link
                            to="/#intro"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C9DDE9] bg-white px-7 py-4 text-sm font-black text-gold-600 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0B6F7A] hover:text-[#0B6F7A]"
                        >
                            <PlayCircle size={19} />
                            شاهد الدرس التعريفي
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-3 rounded-[2rem] border border-[#DCEAF3] bg-white/80 p-3 shadow-xl shadow-[#0B5F7A]/10 backdrop-blur-xl sm:grid-cols-3">
                        {heroFeatures.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="flex items-center justify-center gap-3 rounded-2xl bg-[#F7FBFF] px-4 py-4 text-[#0B2B3F]"
                                >
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-400 text-[#0B6F7A] shadow-sm animate-[spin_5s_linear_infinite] ">
                                        <Icon size={21} />
                                    </span>

                                    <span className="text-sm font-black leading-6">
                                        {feature.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="order-1 lg:order-2 lg:col-start-2">
                    <HeroVisual />
                </div>
            </div>
        </section>
    );
}

function HeroVisual() {
    const [imageError, setImageError] = useState(false);

    const teacherImage = "/images/heroImage.png";

    return (
        <div className="relative mx-auto max-w-xl ">
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#E8F8FA] blur-3xl" />

            <div className="absolute -inset-6 rounded-[3rem] border border-dashed border-[#C39135]/40 [animation:spin_18s_linear_infinite]" />

            <div className="absolute -inset-10 [animation:spin_15s_linear_infinite_reverse]">
                <OrbitItem className="absolute right-4 top-10" icon={Award} color="#C39135" />
                <OrbitItem className="absolute bottom-16 left-2" icon={FileText} color="#0B6F7A" />
                <OrbitItem className="absolute left-12 top-2" icon={Users} color="#16A34A" />
            </div>

            <div className="relative [animation:hero-float_5s_ease-in-out_infinite]">
                <div className="relative rounded-[2.7rem] border border-[#DCEAF3] bg-white/55 p-4 shadow-2xl shadow-[#0B5F7A]/10 backdrop-blur-xl sm:p-5">
                    <div className="absolute -right-3 top-10 z-20 hidden rounded-2xl border border-[#DCEAF3] bg-white px-4 py-3 shadow-xl shadow-[#0B5F7A]/10 sm:block">
                        <div className="flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDF8EC] text-[#C39135] animate-bounce">
                                <Star size={18} fill="currentColor" />
                            </span>
                            <div>
                                <p className="text-xs font-black text-[#0B2B3F]">شرح مبسط</p>
                                <p className="text-[11px] font-bold text-[#6B8293]">خطوة بخطوة</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -left-3 bottom-24 z-20 hidden rounded-2xl border border-[#DCEAF3] bg-white px-4 py-3 shadow-xl shadow-[#0B5F7A]/10 sm:block">
                        <div className="flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8FA] text-[#0B6F7A]">
                                <CheckCircle2 size={18} />
                            </span>
                            <div>
                                <p className="text-xs font-black text-[#0B2B3F]">متابعة مستمرة</p>
                                <p className="text-[11px] font-bold text-[#6B8293]">اختبارات ونتائج</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-visible rounded-[2rem] bg-gradient-to-b from-[#EAF7FC] via-white to-[#FFF8E9] p-5 sm:p-6">
                        <div className="relative mx-auto overflow-hidden rounded-[2rem] border-[6px] border-white bg-[#DDEFF7] shadow-2xl shadow-[#0B5F7A]/15 sm:h-[440px]">
                            {!imageError ? (
                                <img
                                    src={teacherImage}
                                    alt="أ. أحمد المسعود"
                                    onError={() => setImageError(true)}
                                    className="h-full w-full object-cover object-top"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#075B78] to-[#0B2B3F]">
                                    <span className="text-7xl font-black text-white">أ</span>
                                </div>
                            )}

                            <div className="absolute inset-x-4 bottom-2 rounded-[4.5rem] bg-white/30 p-4 text-center shadow-2xl backdrop-blur-md">
                                <h3 className="text-xl font-black text-[#0B2B3F]">
                                    أ. أحمد المسعود
                                </h3>
                                <p className="mt-1 text-md font-black text-[#C39135]">
                                    مدرس اللغة العربية للمرحلة الثانوية
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrbitItem({ icon: Icon, color, className }) {
    return (
        <div
            className={`${className} flex h-12 w-12 items-center justify-center rounded-2xl border border-white bg-white shadow-xl`}
            style={{ color }}
        >
            <Icon size={22} />
        </div>
    );
}