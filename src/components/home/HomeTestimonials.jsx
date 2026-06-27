import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, A11y } from "swiper/modules";

import "swiper/css";

const testimonials = [
    {
        name: "محمد علي",
        grade: "الصف الأول الثانوي",
        image: "https://i.pravatar.cc/160?img=12",
        text: "الشرح منظم جدًا وساعدني أفهم النحو بطريقة أسهل.",
    },
    {
        name: "سارة أحمد",
        grade: "الصف الثاني الثانوي",
        image: "https://i.pravatar.cc/160?img=47",
        text: "التدريبات بعد كل درس فرقت معايا جدًا في تثبيت المعلومة.",
    },
    {
        name: "ملك حسن",
        grade: "الصف الأول الثانوي",
        image: "https://i.pravatar.cc/160?img=32",
        text: "حبيت طريقة تنظيم الدروس والاختبارات القصيرة بعد الشرح.",
    },
    {
        name: "أحمد سامي",
        grade: "الصف الثالث الثانوي",
        image: "https://i.pravatar.cc/160?img=14",
        text: "المنصة ساعدتني أراجع بسرعة قبل الامتحان وأعرف مستوايا.",
    },
    {
        name: "نور محمود",
        grade: "الصف الثاني الثانوي",
        image: "https://i.pravatar.cc/160?img=44",
        text: "أسلوب الشرح بسيط، والملفات بعد كل درس مفيدة جدًا.",
    },
    {
        name: "نور محمود",
        grade: "الصف الثاني الثانوي",
        image: "https://i.pravatar.cc/160?img=44",
        text: "أسلوب الشرح بسيط، والملفات بعد كل درس مفيدة جدًا.",
    },
    {
        name: "نور محمود",
        grade: "الصف الثاني الثانوي",
        image: "https://i.pravatar.cc/160?img=44",
        text: "أسلوب الشرح بسيط، والملفات بعد كل درس مفيدة جدًا.",
    },
    {
        name: "نور محمود",
        grade: "الصف الثاني الثانوي",
        image: "https://i.pravatar.cc/160?img=44",
        text: "أسلوب الشرح بسيط، والملفات بعد كل درس مفيدة جدًا.",
    },
];

export function HomeTestimonials() {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <section className="relative overflow-hidden bg-white/75 px-4 py-20 backdrop-blur-sm sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#E8F8FA] blur-3xl" />
            <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#FFF5DF] blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-gold-300 px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm">
                            <Star size={16} />
                            آراء الطلاب
                        </div>

                        <h2 className="text-3xl font-black text-[#0B2B3F] sm:text-4xl">
                            ماذا قال الطلاب؟
                        </h2>

                        <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-[#587083]">
                            تجارب بسيطة من طلاب استخدموا المنصة في الشرح والمراجعة
                            والتدريب.
                        </p>
                    </div>

                    <div className="hidden items-center gap-3 md:flex">
                        <button
                            ref={prevRef}
                            type="button"
                            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9DDE9] bg-white text-[#0B2B3F] transition hover:border-[#0B6F7A] hover:text-[#0B6F7A] disabled:opacity-40"
                            aria-label="السابق"
                        >
                            <ChevronRight size={20} />
                        </button>

                        <button
                            ref={nextRef}
                            type="button"
                            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9DDE9] bg-white text-[#0B2B3F] transition hover:border-[#0B6F7A] hover:text-[#0B6F7A] disabled:opacity-40"
                            aria-label="التالي"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>
                </div>

                <Swiper
                    dir="rtl"
                    modules={[Navigation, Autoplay, A11y]}
                    speed={550}
                    grabCursor
                    spaceBetween={18}
                    slidesPerView={1.15}
                    autoplay={{
                        delay: 2800,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
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
                            slidesPerView: 1.7,
                            spaceBetween: 18,
                        },
                        768: {
                            slidesPerView: 2.3,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3.3,
                            spaceBetween: 20,
                        },
                        1280: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                    }}
                    className="!pb-4"
                >
                    {testimonials.map((item) => (
                        <SwiperSlide key={item.name} className="!h-auto">
                            <article className="group flex h-full flex-col rounded-[1.75rem] border border-[#DCEAF3] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-white hover:shadow-2xl hover:shadow-[#0B5F7A]/10">
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                loading="lazy"
                                                className="h-14 w-14 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#E6F3F6]"
                                            />
                                            <span className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#C39135] text-white shadow-sm">
                                                <Star size={12} fill="currentColor" />
                                            </span>
                                        </div>

                                        <div>
                                            <p className="font-black text-[#0B2B3F]">
                                                {item.name}
                                            </p>
                                            <p className="mt-1 text-xs font-bold text-[#6B8293]">
                                                {item.grade}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FDF8EC] text-[#C39135]">
                                        <Quote size={20} />
                                    </div>
                                </div>

                                <p className="min-h-[84px] text-sm font-medium leading-7 text-[#41596B]">
                                    {item.text}
                                </p>

                                <div className="mt-5 flex items-center justify-between border-t border-[#E5EEF4] pt-4">
                                    <div className="flex items-center gap-1 text-[#C39135]">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} size={14} fill="currentColor" />
                                        ))}
                                    </div>

                                    <span className="rounded-full bg-[#E8F8FA] px-3 py-1 text-[11px] font-black text-[#0B6F7A]">
                                        تجربة مميزة
                                    </span>
                                </div>
                            </article>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}