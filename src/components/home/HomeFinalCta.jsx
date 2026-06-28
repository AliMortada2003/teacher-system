import { ArrowLeft, BookOpenCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function HomeFinalCta() {
    return (
        <section id="contact" className="bg-transparent px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#06263D] p-8 text-center text-white shadow-2xl shadow-[#06263D]/20 sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#F0C66B]">
                    <BookOpenCheck size={30} />
                </div>

                <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
                    ابدأ رحلتك في اللغة العربية
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-white/70">
                    اختر صفك الدراسي وابدأ التعلم بخطة منظمة تجمع بين الشرح والتدريب
                    والاختبار والمتابعة.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        to="/subjects"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-7 py-4 text-sm font-black text-[#06263D] transition hover:-translate-y-0.5"
                    >
                        اشترك الآن
                        <ArrowLeft size={18} />
                    </Link>

                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-7 py-4 text-sm font-black text-white transition hover:bg-white/10"
                    >
                        تسجيل الدخول
                    </Link>
                </div>
            </div>
        </section>
    );
}