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
    <div className="min-h-screen bg-[#F6FAFB] transition-colors duration-300 dark:bg-[#0B1220]">
      <section className="relative overflow-hidden bg-white px-4 py-16 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950">
        <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#E8F8FA] blur-3xl dark:bg-cyan-400/10" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#FFF5DF] blur-3xl dark:bg-yellow-300/10" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="text-center lg:text-right">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-white px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm transition-colors dark:border-yellow-300/20 dark:bg-yellow-300/15 dark:text-yellow-300 dark:shadow-none">
              <Sparkles size={16} />
              عن منصة الأوائل
            </div>

            <h1 className="text-4xl font-black leading-tight text-[#0B2B3F] transition-colors sm:text-5xl lg:text-6xl dark:text-slate-50">
              منصة تعليمية متكاملة لتعلّم{" "}
              <span className="text-[#C39135] dark:text-yellow-300">
                اللغة العربية
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-9 text-[#41596B] transition-colors lg:mx-0 dark:text-slate-300">
              منصة الأوائل صُممت خصيصًا لطلاب المرحلة الثانوية، لتقديم شرح
              مبسط ومنظم في اللغة العربية مع تدريبات، اختبارات، مراجعات،
              وملفات تساعد الطالب يذاكر بثقة ويتابع مستواه باستمرار.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                to="/subjects"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#075B78] px-7 py-4 text-sm font-black text-white shadow-xl shadow-[#075B78]/20 transition hover:-translate-y-0.5 hover:bg-[#064B64] dark:bg-cyan-500 dark:text-slate-950 dark:shadow-none dark:hover:bg-cyan-400"
              >
                تصفح الكورسات
                <ArrowLeft size={18} />
              </Link>

              <Link
                to="/#intro"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C9DDE9] bg-white px-7 py-4 text-sm font-black text-[#0B2B3F] shadow-sm transition hover:-translate-y-0.5 hover:border-[#0B6F7A] hover:bg-[#F0FAFC] hover:text-[#0B6F7A] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-none dark:hover:border-cyan-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
              >
                <PlayCircle size={19} />
                شاهد الدرس التعريفي
              </Link>
            </div>
          </div>

          <TeacherCard />
        </div>
      </section>

      <section className="px-4 py-12 transition-colors sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-3">
          {aboutStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-[2rem] border border-[#DCEAF3] bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0B5F7A]/10 dark:border-slate-700 dark:bg-slate-900/85 dark:shadow-none dark:hover:border-cyan-400/40 dark:hover:shadow-none"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F8FA] text-[#0B6F7A] transition-colors dark:bg-cyan-400/15 dark:text-cyan-300">
                  <Icon size={25} />
                </div>

                <p className="mt-4 text-3xl font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm font-bold text-[#6B8293] transition-colors dark:text-slate-400">
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
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9EAF2] bg-white px-4 py-2 text-sm font-black text-[#0B6F7A] shadow-sm transition-colors dark:border-yellow-300/20 dark:bg-yellow-300/15 dark:text-yellow-300 dark:shadow-none">
              <GraduationCap size={16} />
              لماذا منصة الأوائل؟
            </div>

            <h2 className="text-3xl font-black text-[#0B2B3F] transition-colors sm:text-4xl dark:text-slate-50">
              كل ما يحتاجه الطالب في مكان واحد
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-[#587083] transition-colors dark:text-slate-300">
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
                  className="group relative overflow-hidden rounded-[2rem] border border-[#DCEAF3] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-white hover:shadow-2xl hover:shadow-[#0B5F7A]/10 dark:border-slate-700 dark:bg-slate-900/85 dark:shadow-none dark:hover:border-cyan-400/40 dark:hover:shadow-none"
                >
                  <div
                    className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full blur-2xl transition group-hover:scale-125 dark:opacity-20"
                    style={{ backgroundColor: feature.soft }}
                  />

                  <div className="pointer-events-none absolute -right-12 bottom-0 h-32 w-32 rounded-full bg-[#E8F8FA]/40 blur-2xl dark:bg-cyan-400/10" />

                  <div className="relative">
                    <div
                      className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ring-8 ring-white transition-colors dark:ring-slate-900"
                      style={{
                        backgroundColor: feature.soft,
                        color: feature.color,
                      }}
                    >
                      <Icon size={25} />
                    </div>

                    <h3 className="text-lg font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm font-medium leading-7 text-[#587083] transition-colors dark:text-slate-400">
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
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-[#DCEAF3] bg-[#075B78] p-8 shadow-2xl shadow-[#075B78]/15 transition-colors sm:p-10 dark:border-cyan-400/20 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950 dark:shadow-none">
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-right">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-[#FFF5DF] dark:bg-yellow-300/10 dark:text-yellow-300">
                <CheckCircle2 size={16} />
                ابدأ رحلتك التعليمية الآن
              </p>

              <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                اختر صفك وابدأ التعلم بطريقة منظمة
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-white/75 dark:text-slate-300">
                دروس، اختبارات، مراجعات، وملفات تحميل تساعدك تذاكر
                بثقة وتتابع تقدمك خطوة بخطوة.
              </p>
            </div>

            <Link
              to="/grades"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-black text-[#075B78] shadow-xl transition hover:-translate-y-0.5 dark:bg-cyan-500 dark:text-slate-950 dark:shadow-none dark:hover:bg-cyan-400"
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
      <div className="pointer-events-none absolute -inset-5 rounded-[3rem] border border-dashed border-[#C39135]/40 animate-[spin_22s_linear_infinite] dark:border-yellow-300/30" />

      <div className="absolute -right-4 top-12 z-20 hidden rounded-2xl border border-[#DCEAF3] bg-white px-4 py-3 shadow-xl shadow-[#0B5F7A]/10 transition-colors sm:block dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDF8EC] text-[#C39135] transition-colors dark:bg-yellow-300/15 dark:text-yellow-300">
            <Award size={18} />
          </span>

          <div>
            <p className="text-xs font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
              خبرة تعليمية
            </p>
            <p className="text-[11px] font-bold text-[#6B8293] transition-colors dark:text-slate-400">
              شرح مبسط ومنظم
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -left-4 bottom-16 z-20 hidden rounded-2xl border border-[#DCEAF3] bg-white px-4 py-3 shadow-xl shadow-[#0B5F7A]/10 transition-colors sm:block dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8FA] text-[#0B6F7A] transition-colors dark:bg-cyan-400/15 dark:text-cyan-300">
            <Star size={18} fill="currentColor" />
          </span>

          <div>
            <p className="text-xs font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
              تقييم مميز
            </p>
            <p className="text-[11px] font-bold text-[#6B8293] transition-colors dark:text-slate-400">
              طلاب المرحلة الثانوية
            </p>
          </div>
        </div>
      </div>

      <div className="relative animate-[hero-float_6s_ease-in-out_infinite] rounded-[2.7rem] border border-[#DCEAF3] bg-white/70 p-4 shadow-2xl shadow-[#0B5F7A]/10 backdrop-blur-xl transition-colors dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-none">
        <div className="overflow-hidden rounded-[2.2rem] bg-gradient-to-b from-[#EAF7FC] via-white to-[#FFF8E9] p-5 transition-colors dark:from-slate-800 dark:via-slate-900 dark:to-slate-950">
          <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white bg-[#DDEFF7] shadow-2xl shadow-[#0B5F7A]/15 transition-colors sm:h-[430px] dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
            {!imageError ? (
              <img
                src={teacherImage}
                alt="أ. أحمد المسعود"
                onError={() => setImageError(true)}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full min-h-[360px] w-full items-center justify-center bg-gradient-to-b from-[#075B78] to-[#0B2B3F] dark:from-cyan-700 dark:to-slate-950">
                <span className="text-7xl font-black text-white">أ</span>
              </div>
            )}

            <div className="absolute inset-x-4 bottom-3 rounded-[2rem] bg-white/35 p-4 text-center shadow-2xl backdrop-blur-md transition-colors dark:bg-slate-950/45 dark:shadow-none">
              <h3 className="text-xl font-black text-[#0B2B3F] transition-colors dark:text-slate-50">
                أ. أحمد المسعود
              </h3>

              <p className="mt-1 text-sm font-black text-[#C39135] transition-colors dark:text-yellow-300">
                مدرس اللغة العربية للمرحلة الثانوية
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}