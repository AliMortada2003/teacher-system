import { useRef } from "react";
import {
    ArrowLeft,
    BookOpenCheck,
    ChevronLeft,
    ChevronRight,
    Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export function HomeCoursesPreview({ courses = [] }) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    if (!courses.length) return null;

    return (
        <section className="relative bg-transparent px-4 py-16 transition-colors sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-[#E8F8FA]/60 blur-3xl dark:bg-cyan-400/10" />
            <div className="pointer-events-none absolute -left-24 bottom-16 h-72 w-72 rounded-full bg-[#FFF5DF]/70 blur-3xl dark:bg-yellow-300/10" />

            <div className="relative mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-gold-300 px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm transition-colors dark:border-yellow-300/20 dark:bg-yellow-300/15 dark:text-yellow-300">
                            <BookOpenCheck size={16} />
                            الكورسات المتاحة
                        </div>

                        <h2 className="text-3xl font-black text-[#0B2B3F] transition-colors sm:text-4xl dark:text-slate-50">
                            كورسات اللغة العربية
                        </h2>

                        <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-[#587083] transition-colors dark:text-slate-300">
                            اختر الصف المناسب وابدأ في مسار منظم يحتوي على دروس واختبارات
                            وموارد.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            ref={prevRef}
                            type="button"
                            className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-[#C9DDE9] bg-white text-[#0B2B3F] transition hover:border-[#0B6F7A] hover:bg-[#F0FAFC] hover:text-[#0B6F7A] disabled:cursor-not-allowed disabled:opacity-40 md:inline-flex dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                            aria-label="السابق"
                        >
                            <ChevronRight size={20} />
                        </button>

                        <button
                            ref={nextRef}
                            type="button"
                            className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-[#C9DDE9] bg-white text-[#0B2B3F] transition hover:border-[#0B6F7A] hover:bg-[#F0FAFC] hover:text-[#0B6F7A] disabled:cursor-not-allowed disabled:opacity-40 md:inline-flex dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                            aria-label="التالي"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <Link
                            to="/subjects"
                            className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#C9DDE9] bg-white px-6 py-3 text-sm font-black text-[#0B2B3F] transition hover:border-[#0B6F7A] hover:bg-[#F0FAFC] hover:text-[#0B6F7A] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                        >
                            كل الكورسات
                            <ArrowLeft size={16} />
                        </Link>
                    </div>
                </div>

                <Swiper
                    dir="rtl"
                    modules={[Navigation, A11y]}
                    speed={450}
                    grabCursor
                    watchOverflow
                    spaceBetween={20}
                    slidesPerView={1.08}
                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 1.6,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 2.15,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                    }}
                    className="!pb-4"
                >
                    {courses.map((course) => {
                        const imageSrc =
                            course.imageUrl ||
                            course.coverImageUrl ||
                            course.thumbnailUrl ||
                            course.image ||
                            course.bannerUrl ||
                            "https://quranteacheracademy.com/wp-content/uploads/2024/04/%D8%AF%D9%88%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D9%84%D8%BA%D8%A9-%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9.jpg";

                        return (
                            <SwiperSlide key={course.id} className="!h-auto">
                                <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0B5F7A]/10 dark:border-slate-700 dark:bg-slate-900/85 dark:shadow-none dark:hover:border-cyan-400/40">
                                    <div className="relative h-52 overflow-hidden bg-[#EFF7FA] transition-colors dark:bg-slate-800">
                                        {imageSrc ? (
                                            <img
                                                src={imageSrc}
                                                alt={course.name || "صورة الكورس"}
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

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#071F2F]/60 via-[#071F2F]/5 to-transparent dark:from-black/75 dark:via-black/10" />

                                        <span className="absolute bottom-4 right-4 rounded-full bg-white/95 px-4 py-2 text-xs font-black text-[#0B6F7A] shadow-sm backdrop-blur-sm transition-colors dark:bg-slate-950/85 dark:text-cyan-300">
                                            {course.level || "منهج كامل"}
                                        </span>

                                        <span className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-2 text-sm font-black text-[#C39135] shadow-sm backdrop-blur-sm transition-colors dark:bg-slate-950/85 dark:text-yellow-300">
                                            <Star size={15} fill="currentColor" />
                                            {course.rating || "5.0"}
                                        </span>
                                    </div>

                                    <div className="flex flex-1 flex-col p-6">
                                        <h3 className="line-clamp-2 text-xl font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                                            {course.name}
                                        </h3>

                                        <p className="mt-2 min-h-[84px] text-sm font-medium leading-7 text-[#587083] line-clamp-3 transition-colors dark:text-slate-400">
                                            {course.description}
                                        </p>

                                        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#F7FBFF] p-3 text-center transition-colors dark:bg-slate-800/80">
                                            <CourseMiniStat
                                                value={course.lessonsCount || 0}
                                                label="درس"
                                            />
                                            <CourseMiniStat
                                                value={course.quizzesCount || 0}
                                                label="اختبار"
                                            />
                                            <CourseMiniStat
                                                value={course.studentsCount || 0}
                                                label="طالب"
                                            />
                                        </div>

                                        <Link
                                            to={`/subjects/${course.id}`}
                                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#075B78] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#075B78]/15 transition hover:bg-[#064B64] dark:bg-cyan-500 dark:text-slate-950 dark:shadow-none dark:hover:bg-cyan-400"
                                        >
                                            عرض الكورس
                                            <ArrowLeft size={16} />
                                        </Link>
                                    </div>
                                </article>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
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