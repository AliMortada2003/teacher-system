import {
    ArrowLeft,
    Clock3,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
} from "lucide-react";
import { Link } from "react-router-dom";

const contactInfo = [
    {
        title: "رقم التواصل",
        value: "01000000000",
        icon: Phone,
        color: "#0B6F7A",
        soft: "#E8F8FA",
        href: "tel:01000000000",
    },
    {
        title: "واتساب",
        value: "راسلنا مباشرة",
        icon: MessageCircle,
        color: "#16A34A",
        soft: "#ECFDF3",
        href: "https://wa.me/201000000000",
    },
    {
        title: "البريد الإلكتروني",
        value: "support@awael.com",
        icon: Mail,
        color: "#C39135",
        soft: "#FFF5DF",
        href: "mailto:support@awael.com",
    },
    {
        title: "المواعيد",
        value: "يوميًا من 10 ص إلى 10 م",
        icon: Clock3,
        color: "#4F46E5",
        soft: "#EEF2FF",
        href: null,
    },
];

export default function Contact() {
    return (
        <div className="min-h-screen bg-[#F6FAFB] transition-colors duration-300 dark:bg-[#0B1220]">
            <section className="relative overflow-hidden bg-white px-4 py-16 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950">
                <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#E8F8FA] blur-3xl dark:bg-cyan-400/10" />
                <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#FFF5DF] blur-3xl dark:bg-yellow-300/10" />

                <div className="relative mx-auto max-w-7xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-white px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm transition-colors dark:border-yellow-300/20 dark:bg-yellow-300/15 dark:text-yellow-300 dark:shadow-none">
                        تواصل معنا
                    </div>

                    <h1 className="text-4xl font-black leading-tight text-[#0B2B3F] transition-colors sm:text-5xl dark:text-slate-50">
                        عندك سؤال؟ إحنا معاك خطوة بخطوة
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-[#587083] transition-colors dark:text-slate-300">
                        تواصل معنا للاستفسار عن الصفوف، الاشتراك، مواعيد الدروس، أو أي
                        مشكلة تواجهك داخل المنصة.
                    </p>
                </div>
            </section>

            <section className="px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    {/* contact form */}
                    <div className="rounded-[2.5rem] border border-[#DCEAF3] bg-white p-5 shadow-sm transition-colors sm:p-7 dark:border-slate-700 dark:bg-slate-900/85 dark:shadow-none">
                        <div className="mb-7">
                            <p className="text-sm font-black text-[#0B6F7A] transition-colors dark:text-cyan-300">
                                ارسل رسالة
                            </p>

                            <h2 className="mt-2 text-3xl font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                                سيب بياناتك وهنرد عليك
                            </h2>

                            <p className="mt-3 text-sm font-medium leading-7 text-[#587083] transition-colors dark:text-slate-400">
                                اكتب رسالتك أو استفسارك، وهيتم التواصل معاك في أقرب وقت.
                            </p>
                        </div>

                        <form
                            className="grid gap-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                            }}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="الاسم" placeholder="اكتب اسمك" />
                                <Field label="رقم الهاتف" placeholder="اكتب رقم الهاتف" />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="الصف الدراسي" placeholder="مثال: تالتة ثانوي" />
                                <Field label="نوع الاستفسار" placeholder="اشتراك / مشكلة / سؤال" />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                                    الرسالة
                                </label>

                                <textarea
                                    rows={6}
                                    placeholder="اكتب رسالتك هنا..."
                                    className="w-full resize-none rounded-2xl border border-[#D6E4EE] bg-[#F8FCFF] px-4 py-4 text-sm font-bold leading-7 text-[#0B2B3F] outline-none transition placeholder:text-[#8AA0B1] focus:border-[#0B6F7A] focus:bg-white focus:ring-4 focus:ring-[#0B6F7A]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:bg-slate-950 dark:focus:ring-cyan-400/10"
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#075B78] px-6 py-4 text-sm font-black text-white shadow-xl shadow-[#075B78]/20 transition hover:-translate-y-0.5 hover:bg-[#064B64] dark:bg-cyan-500 dark:text-slate-950 dark:shadow-none dark:hover:bg-cyan-400"
                            >
                                إرسال الرسالة
                                <Send size={17} />
                            </button>
                        </form>
                    </div>
                    <div className="grid  gap-5">
                        {/* social Links */}
                        <div className="rounded-[2.5rem] border border-[#DCEAF3] bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900/85 dark:shadow-none">
                            <h2 className="text-2xl font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                                تابعنا على السوشيال
                            </h2>

                            <p className="mt-3 text-sm font-medium leading-7 text-[#587083] transition-colors dark:text-slate-400">
                                تابع آخر الأخبار، المراجعات، ومواعيد الدروس من خلال صفحاتنا.
                            </p>

                            <div className="mt-6 grid md:grid-cols-3 gap-3">
                                <SocialLink
                                    href="https://facebook.com"
                                    icon={Facebook}
                                    label="Facebook"
                                    color="#1877F2"
                                    soft="#EAF2FF"
                                />

                                <SocialLink
                                    href="https://instagram.com"
                                    icon={Instagram}
                                    label="Instagram"
                                    color="#E1306C"
                                    soft="#FFF0F6"
                                />

                                <SocialLink
                                    href="https://wa.me/201000000000"
                                    icon={MessageCircle}
                                    label="WhatsApp"
                                    color="#16A34A"
                                    soft="#ECFDF3"
                                />
                            </div>

                            <Link
                                to="/subjects"
                                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#C9DDE9] bg-white px-6 py-4 text-sm font-black text-[#0B2B3F] transition hover:border-[#0B6F7A] hover:bg-[#F0FAFC] hover:text-[#0B6F7A] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                            >
                                تصفح الكورسات
                                <ArrowLeft size={16} />
                            </Link>
                        </div>
                        {/* google Maps */}
                        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#DCEAF3] bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900/85 dark:shadow-none">
                            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#E8F8FA] blur-3xl dark:bg-cyan-400/10" />

                            <div className="relative">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F8FA] text-[#0B6F7A] transition-colors dark:bg-cyan-400/15 dark:text-cyan-300">
                                    <MapPin size={25} />
                                </div>

                                <h2 className="text-2xl font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                                    مكان السنتر / المكتب
                                </h2>

                                <p className="mt-3 max-w-xl text-sm font-medium leading-7 text-[#587083] transition-colors dark:text-slate-400">
                                    يمكنك وضع العنوان هنا أو استبدال هذا الجزء بخريطة Google
                                    Maps حسب بيانات السنتر.
                                </p>

                                <div className="mt-6 flex min-h-[260px] items-center justify-center rounded-[2rem] border border-dashed border-[#C9DDE9] bg-[#F8FCFF] text-center transition-colors dark:border-slate-700 dark:bg-slate-950/70">
                                    <div>
                                        <MapPin
                                            className="mx-auto text-[#C39135] dark:text-yellow-300"
                                            size={44}
                                        />
                                        <p className="mt-3 text-sm font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                                            خريطة الموقع
                                        </p>
                                        <p className="mt-1 text-xs font-bold text-[#6B8293] transition-colors dark:text-slate-400">
                                            أضف iframe خريطة Google هنا
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 pb-20 sm:px-6 lg:px-8">

            </section>
        </div>
    );
}

function Field({ label, placeholder }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                {label}
            </label>

            <input
                placeholder={placeholder}
                className="h-14 w-full rounded-2xl border border-[#D6E4EE] bg-[#F8FCFF] px-4 text-sm font-bold text-[#0B2B3F] outline-none transition placeholder:text-[#8AA0B1] focus:border-[#0B6F7A] focus:bg-white focus:ring-4 focus:ring-[#0B6F7A]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:bg-slate-950 dark:focus:ring-cyan-400/10"
            />
        </div>
    );
}

function SocialLink({ href, icon: Icon, label, color, soft }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-2xl border border-[#DCEAF3] bg-[#F8FCFF] p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg dark:border-slate-700 dark:bg-slate-950/70 dark:hover:border-cyan-400/40 dark:hover:bg-slate-800 dark:hover:shadow-none"
        >
            <div className="flex items-center gap-3">
                <span
                    className="flex h-11 w-11 items-center justify-center rounded-2xl ring-8 ring-white transition-colors dark:ring-slate-950"
                    style={{ backgroundColor: soft, color }}
                >
                    <Icon size={21} />
                </span>

                <span className="text-sm font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                    {label}
                </span>
            </div>

            <ArrowLeft
                size={16}
                className="text-[#6B8293] transition group-hover:text-[#0B6F7A] dark:text-slate-400 dark:group-hover:text-cyan-300"
            />
        </a>
    );
}