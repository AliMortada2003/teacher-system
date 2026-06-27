import { Link } from "react-router-dom";
import { BookOpenCheck, Facebook, Instagram, Youtube } from "lucide-react";

export function PublicFooter() {
    return (
        <footer className="bg-[#06263D] text-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#F0C66B]">
                        <BookOpenCheck size={23} />
                    </span>

                    <div>
                        <h2 className="text-lg font-black">الأوائل</h2>
                        <p className="text-sm text-white/65">
                            تعلّم اللغة العربية بخطة منظمة للمرحلة الثانوية.
                        </p>
                    </div>
                </div>

                <p className="text-sm text-white/60">
                    © 2026 منصة الأوائل. جميع الحقوق محفوظة.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                    <Link to="/privacy" className="transition hover:text-white">
                        سياسة الخصوصية
                    </Link>

                    <Link to="/terms" className="transition hover:text-white">
                        الشروط والأحكام
                    </Link>

                    <div className="flex items-center gap-2">
                        <a
                            href="#"
                            aria-label="YouTube"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                        >
                            <Youtube size={17} />
                        </a>

                        <a
                            href="#"
                            aria-label="Instagram"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                        >
                            <Instagram size={17} />
                        </a>

                        <a
                            href="#"
                            aria-label="Facebook"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                        >
                            <Facebook size={17} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}