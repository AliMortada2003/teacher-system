import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    BookOpenCheck,
    LayoutDashboard,
    LogIn,
    Menu,
    Moon,
    Sun,
    UserPlus,
    X,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
    { label: "الرئيسية", href: "/" },
    { label: "الصفوف", href: "/grades" },
    { label: "المواد", href: "/subjects" },
    { label: "عن المنصة", href: "/about" },
    { label: "تواصل معنا", href: "/contact" },
];

function getStoredAuth() {
    if (typeof window === "undefined") {
        return { user: null, token: null };
    }

    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken");

    const rawUser =
        localStorage.getItem("user") ||
        localStorage.getItem("authUser") ||
        localStorage.getItem("currentUser");

    let user = null;

    try {
        user = rawUser ? JSON.parse(rawUser) : null;
    } catch {
        user = null;
    }

    return { user, token };
}

function getDashboardPath(user) {
    const role = String(user?.role || user?.userRole || "").toLowerCase();

    if (role.includes("admin")) return "/admin-dashboard";
    if (role.includes("teacher") || role.includes("instructor")) {
        return "/teacher-dashboard";
    }

    return "/dashboard";
}

function isActivePath(location, href) {
    if (href === "/") {
        return location.pathname === "/" && !location.hash;
    }

    if (href.startsWith("/#")) {
        return location.pathname === "/" && location.hash === href.replace("/", "");
    }

    return location.pathname === href;
}

export function PublicHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [auth, setAuth] = useState(() => getStoredAuth());
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname, location.hash]);

    useEffect(() => {
        const syncAuth = () => {
            setAuth(getStoredAuth());
        };

        window.addEventListener("storage", syncAuth);
        window.addEventListener("auth-changed", syncAuth);

        return () => {
            window.removeEventListener("storage", syncAuth);
            window.removeEventListener("auth-changed", syncAuth);
        };
    }, []);

    const isLoggedIn = Boolean(auth.token || auth.user);
    const dashboardPath = useMemo(() => getDashboardPath(auth.user), [auth.user]);

    return (
        <header className="sticky top-0 z-50 border-b border-[#E4EEF4]/90 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="group flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-100 bg-slate-100 text-cyan-500 shadow-sm ring-1 ring-cyan-500/20 transition group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-[#C39135]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-cyan-300 dark:ring-cyan-300/20">
                        <BookOpenCheck size={25} />
                    </span>

                    <span className="text-2xl font-black tracking-tight text-[#009dff] dark:text-slate-50">
                        <span className="text-cyan-500 dark:text-cyan-300">
                            الأوائل
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-8 lg:flex">
                    {navItems.map((item) => {
                        const active = isActivePath(location, item.href);

                        return (
                            <Link
                                key={item.label}
                                to={item.href}
                                className={[
                                    "group relative py-2 text-sm font-bold transition",
                                    active
                                        ? "bg-cyan-600 text-white rounded-lg px-2 "
                                        : "text-[#304A5F] hover:text-[#0B6F7A] dark:text-slate-300 dark:hover:text-cyan-300",
                                ].join(" ")}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D6E4EE] bg-white text-[#0B2B3F] shadow-sm transition hover:-translate-y-0.5 hover:border-[#0B6F7A] hover:bg-[#F0FAFC] hover:text-[#0B6F7A] dark:border-slate-700 dark:bg-slate-900 dark:text-yellow-300 dark:hover:border-yellow-300/50 dark:hover:bg-slate-800"
                        aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
                        title={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    {isLoggedIn ? (
                        <Link
                            to={dashboardPath}
                            className="inline-flex items-center gap-2 rounded-2xl bg-[#075B78] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#075B78]/15 transition hover:-translate-y-0.5 hover:bg-[#064B64] dark:bg-cyan-500 dark:text-slate-950 dark:shadow-none dark:hover:bg-cyan-400"
                        >
                            <LayoutDashboard size={18} />
                            الداشبورد
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 rounded-2xl border border-[#D6E4EE] bg-white px-5 py-3 text-sm font-black text-[#0B2B3F] transition hover:border-[#0B6F7A] hover:bg-[#F0FAFC] hover:text-[#0B6F7A] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                            >
                                <LogIn size={18} />
                                تسجيل الدخول
                            </Link>

                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#075B78] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#075B78]/15 transition hover:-translate-y-0.5 hover:bg-[#064B64] dark:bg-cyan-500 dark:text-slate-950 dark:shadow-none dark:hover:bg-cyan-400"
                            >
                                <UserPlus size={18} />
                                إنشاء حساب
                            </Link>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setIsOpen((value) => !value)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D6E4EE] bg-white text-[#0B2B3F] transition hover:border-[#0B6F7A] hover:bg-[#F0FAFC] hover:text-[#0B6F7A] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300 lg:hidden"
                    aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {isOpen && (
                <div className="border-t border-[#DDEAF3] bg-white/95 px-4 py-4 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
                    <nav className="mx-auto grid max-w-7xl gap-2">
                        {navItems.map((item) => {
                            const active = isActivePath(location, item.href);

                            return (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={[
                                        "rounded-2xl px-4 py-3 text-sm font-bold transition",
                                        active
                                            ? "bg-[#E8F8FA] text-[#0B6F7A] dark:bg-cyan-500/10 dark:text-cyan-300"
                                            : "text-[#304A5F] hover:bg-[#F0F8FC] hover:text-[#0B6F7A] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-300",
                                    ].join(" ")}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className="mt-3 grid gap-3">
                            {isLoggedIn ? (
                                <Link
                                    to={dashboardPath}
                                    onClick={() => setIsOpen(false)}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#075B78] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#064B64] dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                                >
                                    <LayoutDashboard size={18} />
                                    الداشبورد
                                </Link>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D6E4EE] bg-white px-5 py-3 text-center text-sm font-black text-[#0B2B3F] transition hover:border-[#0B6F7A] hover:bg-[#F0FAFC] hover:text-[#0B6F7A] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                                    >
                                        <LogIn size={18} />
                                        دخول
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#075B78] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#064B64] dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                                    >
                                        <UserPlus size={18} />
                                        تسجيل
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}