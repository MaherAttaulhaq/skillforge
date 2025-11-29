import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Briefcase, Users } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <>
      <section className="relative py-20 sm:py-32">
        <div className="absolute inset-0 top-0 h-1/2 w-full bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10"></div>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center gap-8 text-center lg:text-left">
              <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl lg:text-7xl">
                  Unlock Your <span className="text-primary">Career Potential</span> with AI
                </h1>
                <h2 className="max-w-xl text-lg text-muted-foreground mx-auto lg:mx-0">
                  Get instant feedback, match with top jobs, and join a community of learners.
                </h2>
              </div>
              <div className="mx-auto w-full max-w-lg lg:mx-0">
                <form className="group relative">
                  <Input
                    className="h-14 w-full rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 py-3 pl-6 pr-32 text-base shadow-sm transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background"
                    placeholder="Drop your resume here or click to upload"
                    type="file"
                  />
                  <Button
                    className="absolute inset-y-1.5 right-1.5 flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold shadow-md transition-all"
                    type="submit"
                  >
                    Analyze Now
                  </Button>
                </form>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Free analysis, no sign-up required. PDF, DOCX supported.
                </p>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-lg rounded-xl">
                <div className="absolute -inset-2 rounded-xl bg-gradient-to-br from-primary to-accent opacity-20 blur-2xl"></div>
                <img
                  alt="A modern, abstract AI illustration showing interconnected nodes, representing career paths and data analysis."
                  className="relative w-full h-full object-cover rounded-2xl shadow-lg"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxMLOq2Lga7_dM2B9y2N3ycyCYi6pkJXyJ-9l4_0zLDPmrX1Utj23OdEk0UoCd9HS3w1E7hyQz9MxCf3laVbp4ucMrKZh8bn6lT_5N8PuoS3CQHJe0yX2XKpkaepBSD-XEH7k8MF7ZL7h9MuIy2s44u3Fbmn2_d_-JkvlfkvfV80yeu6QLWJrcQehMcA5MYk2Hgwm_EepYO3Cp9VUn6bSB24MHeqjfs3ao_U-r-byjiRb1MaTX8zCX9RmErzFLB_ZhdAqlduVPamk"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background dark:bg-slate-900 py-20 sm:py-24" id="features">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4 text-center">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Why Choose SkillForge?</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Our platform provides comprehensive tools to help you stand out in the job market and continuously improve your skills.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">AI Resume Analyzer</h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant feedback on keywords, formatting, and skill gaps to create a standout resume.
                  </p>
                </div>
              </div>
              <div className="group flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">Intelligent Job Matching</h3>
                  <p className="text-sm text-muted-foreground">
                    Our smart algorithm connects your unique skills to the most relevant job openings.
                  </p>
                </div>
              </div>
              <div className="group flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Users className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">Social Learning Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Engage with peers, get expert advice, and share resources to accelerate your career growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24" id="how-it-works">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-16 items-center">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Get Started in 3 Simple Steps</h2>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Unlock your career potential with our streamlined process.
              </p>
            </div>
            <div className="relative w-full">
              <div className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-0.5 -translate-x-1/2 bg-slate-200 dark:bg-slate-800 md:block"></div>
              <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
                <div className="relative flex flex-col items-center gap-4 text-center md:items-start md:text-left">
                  <div className="z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-primary bg-background text-2xl font-bold text-primary">
                    1
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-semibold">Upload Resume</h3>
                    <p className="text-base text-muted-foreground">
                      Securely upload your current resume in PDF or DOCX format.
                    </p>
                  </div>
                </div>
                <div className="relative flex flex-col items-center gap-4 text-center md:items-center">
                  <div className="z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-primary bg-background text-2xl font-bold text-primary">
                    2
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-semibold">Receive AI Insights</h3>
                    <p className="text-base text-muted-foreground">
                      Our AI generates a detailed report with actionable feedback in seconds.
                    </p>
                  </div>
                </div>
                <div className="relative flex flex-col items-center gap-4 text-center md:items-end md:text-right">
                  <div className="z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-primary bg-background text-2xl font-bold text-primary">
                    3
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-semibold">Discover Opportunities</h3>
                    <p className="text-base text-muted-foreground">
                      Explore tailored job matches and personalized learning paths.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background dark:bg-slate-900 py-20 sm:py-24" id="testimonials">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center gap-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Trusted by Professionals</h2>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                See what our users are saying about their success with SkillForge.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="group flex flex-col justify-between gap-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
                <blockquote className="text-base italic text-foreground">
                  &quot;SkillForge&apos;s AI feedback was a game-changer. It highlighted keywords I&apos;d missed and helped me land three interviews in a week!&quot;
                </blockquote>
                <div className="flex items-center gap-4">
                  <img
                    alt="Profile picture of Sarah L."
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM75mOO6O2s6GHcaYQjrhy7Zr9rm-SpH16P1doqJoEgd8vA5-gQT9GLDX2DabayTK0gKYrGFDUkojRk6SP6C3JWg9A-D-Hj2RBG6-ExuBHrffvfkCBdOjmnNtMoQRAS5lRVMNOAFXyupYl6LG8O9Nz0E4F6wyqYNbEt3KxirVZo5j-M2pI41OxBOzLNifhkAWmgYFh1vgXL4x8E08x9Rxv8XZ_Zd4bo9X9i6iv04UIPne-Dn2wMyV7toShs0w-odMH-VZ1pC-2_w4"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Sarah L.</p>
                    <p className="text-sm text-muted-foreground">Marketing Manager</p>
                  </div>
                </div>
              </div>
              <div className="group flex flex-col justify-between gap-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
                <blockquote className="text-base italic text-foreground">
                  &quot;The job matching is incredibly accurate. I stopped wasting time on irrelevant applications and found a role that perfectly fits my skills.&quot;
                </blockquote>
                <div className="flex items-center gap-4">
                  <img
                    alt="Profile picture of Michael B."
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuABbXmAvSmEGstIIMrXDO3RyFwazEj5h2YmUypGsQN6Quco46CEgthDfpgxM2pgMbgA2z4Qe2FeF0bpDnsbcGrQIoJiVvwHDKufN6kbx2lqG9DtUIGemdcthmEzIc5uJn9xggIHSuOAEOSoST6oyMHPQZ_bi0jIbe4l9x35a8e6Cz8hLXvcGxo3999ERaon1p_Bhs2trCu2nJZtB_LEhK9BeMlJUjwH_0Iag8PPtvDFaHNUTfKf7i9_OrjD6XedS1i_qBprkveGBk4"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Michael B.</p>
                    <p className="text-sm text-muted-foreground">Software Engineer</p>
                  </div>
                </div>
              </div>
              <div className="group flex flex-col justify-between gap-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
                <blockquote className="text-base italic text-foreground">
                  &quot;The community aspect is fantastic. Getting peer reviews on my resume before applying gave me so much more confidence.&quot;
                </blockquote>
                <div className="flex items-center gap-4">
                  <img
                    alt="Profile picture of Emily C."
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq1h71T8E6weouip03ZnSX3bSEZD86rn3FBOrZKlZ8kV-KJP3iKebaBRZEqiMzvx3AfnZdssum3INIjWPWWLA0G-rXtjJZAjKMvti1YyjugypE2FZ7c6k1S2xOlrnJY0r_geTBK5FKzKtCL00jfAB5BzteN4wil3CwlbZMvrmjSkrfgX1Pcdug_qqSyEJ7ENhvS7SH1oh6QEkXufqcvYYKigbMTE68v98otfZ7nxYOQ-LsL7EenpU52mdWy8EOJOk6ZrY3D80yURA"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Emily C.</p>
                    <p className="text-sm text-muted-foreground">UX Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
