import { HomeCoursesPreview } from "../../components/home/HomeCoursesPreview";
import { HomeFinalCta } from "../../components/home/HomeFinalCta";
import { HomeHero } from "../../components/home/HomeHero";
import { HomeResources } from "../../components/home/HomeResources";
import { useHomeCourses } from "../../hooks/useHomeCourses";
import { HomeGradeTracks } from "../../components/home/HomeGradeTracks";
import { HomeTestimonials } from "../../components/home/HomeTestimonials";

export default function HomePage() {
    const courses = useHomeCourses();

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#F6FAFB] text-[#0B2B3F] transition-colors duration-300 dark:bg-[#0B1220] dark:text-slate-100">
            <HomePageBackground />

            <div className="relative z-10">
                <HomeHero />
                <HomeGradeTracks />
                <HomeCoursesPreview courses={courses} />
                <HomeResources />
                <HomeTestimonials />
                <HomeFinalCta />
            </div>
        </div>
    );
}

function HomePageBackground() {
    const floatingLetters = [
        {
            text: "أ",
            className:
                "right-[8%] top-[150px] text-[#0B6F7A]/[0.055] dark:text-cyan-300/[0.055]",
        },
        {
            text: "ض",
            className:
                "left-[10%] top-[360px] text-[#C39135]/[0.06] dark:text-yellow-300/[0.05]",
        },
        {
            text: "ق",
            className:
                "right-[18%] top-[720px] text-[#0B2B3F]/[0.04] dark:text-white/[0.04]",
        },
        {
            text: "ن",
            className:
                "left-[16%] top-[980px] text-[#0B6F7A]/[0.045] dark:text-cyan-300/[0.04]",
        },
        {
            text: "ع",
            className:
                "right-[10%] top-[1320px] text-[#C39135]/[0.05] dark:text-yellow-300/[0.045]",
        },
    ];

    return (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {/* light base */}
            <div className="absolute inset-0 bg-[#F7FAF9] dark:hidden" />

            {/* dark base */}
            <div className="absolute inset-0 hidden bg-[#0B1220] dark:block" />

            {/* light premium calm wash */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(11,111,122,0.105),transparent_30%),radial-gradient(circle_at_12%_22%,rgba(195,145,53,0.085),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(120,198,176,0.09),transparent_35%),linear-gradient(180deg,#F7FAF9_0%,#FFFFFF_38%,#F4F8FA_100%)] dark:hidden" />

            {/* dark premium calm wash */}
            <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_88%_8%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_12%_22%,rgba(247,215,25,0.08),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(20,184,166,0.08),transparent_35%),linear-gradient(180deg,#0B1220_0%,#111827_42%,#0B1220_100%)] dark:block" />

            {/* very soft paper grain */}
            <div className="absolute inset-0 opacity-[0.055] [background-image:radial-gradient(#0B2B3F_0.55px,transparent_0.55px)] [background-size:22px_22px] dark:opacity-[0.08] dark:[background-image:radial-gradient(#FFFFFF_0.55px,transparent_0.55px)]" />

            {/* subtle notebook lines */}
            <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_bottom,#0B2B3F_1px,transparent_1px)] [background-size:100%_46px] dark:opacity-[0.045] dark:[background-image:linear-gradient(to_bottom,#FFFFFF_1px,transparent_1px)]" />

            {/* soft arabesque corner shapes */}
            <div className="absolute -right-20 top-32 h-72 w-72 rounded-[42%_58%_51%_49%/46%_40%_60%_54%] border border-[#0B6F7A]/10 dark:border-cyan-300/10" />
            <div className="absolute -right-10 top-44 h-48 w-48 rounded-[55%_45%_48%_52%/40%_55%_45%_60%] border border-[#C39135]/10 dark:border-yellow-300/10" />

            <div className="absolute -left-24 top-[620px] h-80 w-80 rounded-[48%_52%_38%_62%/52%_42%_58%_48%] border border-[#C39135]/10 dark:border-yellow-300/10" />
            <div className="absolute -left-10 top-[690px] h-52 w-52 rounded-[44%_56%_55%_45%/48%_58%_42%_52%] border border-[#0B6F7A]/10 dark:border-cyan-300/10" />

            {/* soft decorative blobs */}
            <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-[#BEE8F4]/20 blur-[90px] dark:bg-cyan-400/10" />
            <div className="absolute -left-32 top-[760px] h-[420px] w-[420px] rounded-full bg-[#F5D58A]/14 blur-[95px] dark:bg-yellow-300/10" />
            <div className="absolute right-[18%] top-[1180px] h-80 w-80 rounded-full bg-[#D8F0E9]/16 blur-[90px] dark:bg-emerald-300/10" />

            {/* floating Arabic letters */}
            {floatingLetters.map((item) => (
                <span
                    key={`${item.text}-${item.className}`}
                    className={[
                        "absolute hidden select-none font-serif text-[9rem] font-black leading-none md:block",
                        item.className,
                    ].join(" ")}
                >
                    {item.text}
                </span>
            ))}

            {/* soft dividers */}
            <div className="absolute left-1/2 top-24 h-px w-[78%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#C8DCE5]/70 to-transparent dark:via-white/10" />
            <div className="absolute left-1/2 top-[560px] h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E5EEF2]/80 to-transparent dark:via-white/10" />

            {/* calm vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_62%,rgba(11,43,63,0.035)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,transparent_60%,rgba(0,0,0,0.28)_100%)]" />

            {/* bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-white/80 to-transparent dark:from-[#0B1220]/95" />
        </div>
    );
}