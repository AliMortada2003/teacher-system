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
        <div className="min-h-screen bg-[#F6FAFB]">
            <section className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#E8F8FA] blur-3xl" />
                <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#FFF5DF] blur-3xl" />

                <div className="relative mx-auto max-w-7xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-white px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm">
                        تواصل معنا
                    </div>

                    <h1 className="text-4xl font-black leading-tight text-[#0B2B3F] sm:text-5xl">
                        عندك سؤال؟ إحنا معاك خطوة بخطوة
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-[#587083]">
                        تواصل معنا للاستفسار عن الصفوف، الاشتراك، مواعيد الدروس، أو أي
                        مشكلة تواجهك داخل المنصة.
                    </p>
                </div>
            </section>

            <section className="px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="space-y-5">
                        {contactInfo.map((item) => {
                            const Icon = item.icon;

                            const CardContent = (
                                <div className="group relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-white hover:shadow-2xl hover:shadow-[#0B5F7A]/10">
                                    <div
                                        className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full blur-2xl transition group-hover:scale-125"
                                        style={{ backgroundColor: item.soft }}
                                    />

                                    <div className="relative flex items-center gap-4">
                                        <div
                                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                                            style={{
                                                backgroundColor: item.soft,
                                                color: item.color,
                                            }}
                                        >
                                            <Icon size={24} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-black text-[#6B8293]">
                                                {item.title}
                                            </p>

                                            <p className="mt-1 text-lg font-black text-[#0B2B3F]">
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );

                            return item.href ? (
                                <a
                                    key={item.title}
                                    href={item.href}
                                    target={item.href.startsWith("http") ? "_blank" : undefined}
                                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                                >
                                    {CardContent}
                                </a>
                            ) : (
                                <div key={item.title}>{CardContent}</div>
                            );
                        })}

                        <div className="rounded-[2rem] border border-[#DCEAF3] bg-[#075B78] p-6 shadow-2xl shadow-[#075B78]/15">
                            <p className="text-sm font-black text-[#FFF5DF]">
                                أسرع طريقة للتواصل
                            </p>

                            <h2 className="mt-2 text-2xl font-black text-white">
                                راسلنا على واتساب
                            </h2>

                            <p className="mt-3 text-sm font-medium leading-7 text-white/75">
                                لو عندك استفسار سريع عن الاشتراك أو الصف المناسب، ابعتلنا
                                رسالة وهنتابع معاك.
                            </p>

                            <a
                                href="https://wa.me/201000000000"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#075B78] transition hover:-translate-y-0.5"
                            >
                                افتح واتساب
                                <ArrowLeft size={16} />
                            </a>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border border-[#DCEAF3] bg-white p-5 shadow-sm sm:p-7">
                        <div className="mb-7">
                            <p className="text-sm font-black text-[#0B6F7A]">
                                ارسل رسالة
                            </p>

                            <h2 className="mt-2 text-3xl font-black text-[#0B2B3F]">
                                سيب بياناتك وهنرد عليك
                            </h2>

                            <p className="mt-3 text-sm font-medium leading-7 text-[#587083]">
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
                                <label className="mb-2 block text-sm font-black text-[#0B2B3F]">
                                    الرسالة
                                </label>

                                <textarea
                                    rows={6}
                                    placeholder="اكتب رسالتك هنا..."
                                    className="w-full resize-none rounded-2xl border border-[#D6E4EE] bg-[#F8FCFF] px-4 py-4 text-sm font-bold leading-7 text-[#0B2B3F] outline-none transition placeholder:text-[#8AA0B1] focus:border-[#0B6F7A] focus:bg-white focus:ring-4 focus:ring-[#0B6F7A]/10"
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#075B78] px-6 py-4 text-sm font-black text-white shadow-xl shadow-[#075B78]/20 transition hover:-translate-y-0.5 hover:bg-[#064B64]"
                            >
                                إرسال الرسالة
                                <Send size={17} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <section className="px-4 pb-20 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-[#DCEAF3] bg-white p-6 shadow-sm">
                        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#E8F8FA] blur-3xl" />

                        <div className="relative">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F8FA] text-[#0B6F7A]">
                                <MapPin size={25} />
                            </div>

                            <h2 className="text-2xl font-black text-[#0B2B3F]">
                                مكان السنتر / المكتب
                            </h2>

                            <p className="mt-3 max-w-xl text-sm font-medium leading-7 text-[#587083]">
                                يمكنك وضع العنوان هنا أو استبدال هذا الجزء بخريطة Google
                                Maps حسب بيانات السنتر.
                            </p>

                            <div className="mt-6 flex min-h-[260px] items-center justify-center rounded-[2rem] border border-dashed border-[#C9DDE9] bg-[#F8FCFF] text-center">
                                <div>
                                    <MapPin className="mx-auto text-[#C39135]" size={44} />
                                    <p className="mt-3 text-sm font-black text-[#0B2B3F]">
                                        خريطة الموقع
                                    </p>
                                    <p className="mt-1 text-xs font-bold text-[#6B8293]">
                                        أضف iframe خريطة Google هنا
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border border-[#DCEAF3] bg-white p-6 shadow-sm">
                        <h2 className="text-2xl font-black text-[#0B2B3F]">
                            تابعنا على السوشيال
                        </h2>

                        <p className="mt-3 text-sm font-medium leading-7 text-[#587083]">
                            تابع آخر الأخبار، المراجعات، ومواعيد الدروس من خلال صفحاتنا.
                        </p>

                        <div className="mt-6 grid gap-3">
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
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#C9DDE9] bg-white px-6 py-4 text-sm font-black text-[#0B2B3F] transition hover:border-[#0B6F7A] hover:text-[#0B6F7A]"
                        >
                            تصفح الكورسات
                            <ArrowLeft size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Field({ label, placeholder }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-black text-[#0B2B3F]">
                {label}
            </label>

            <input
                placeholder={placeholder}
                className="h-14 w-full rounded-2xl border border-[#D6E4EE] bg-[#F8FCFF] px-4 text-sm font-bold text-[#0B2B3F] outline-none transition placeholder:text-[#8AA0B1] focus:border-[#0B6F7A] focus:bg-white focus:ring-4 focus:ring-[#0B6F7A]/10"
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
            className="group flex items-center justify-between rounded-2xl border border-[#DCEAF3] bg-[#F8FCFF] p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
        >
            <div className="flex items-center gap-3">
                <span
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: soft, color }}
                >
                    <Icon size={21} />
                </span>

                <span className="text-sm font-black text-[#0B2B3F]">
                    {label}
                </span>
            </div>

            <ArrowLeft
                size={16}
                className="text-[#6B8293] transition group-hover:text-[#0B6F7A]"
            />
        </a>
    );
}