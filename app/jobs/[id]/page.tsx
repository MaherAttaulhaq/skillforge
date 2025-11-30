import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Bookmark,
  Sparkles,
  Briefcase,
  Users,
  Calendar
} from "lucide-react"
import Link from "next/link"

export default function JobDetailPage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-8 text-sm">
        <Link
          href="/jobs"
          className="text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          Jobs
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link
          href="/jobs"
          className="text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          Search Results
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">Senior Product Designer</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-12">
        {/* Left Column (Sticky Summary) */}
        <div className="lg:col-span-2 lg:sticky lg:top-28 h-fit mb-8 lg:mb-0">
          <div className="flex flex-col gap-6">
            {/* Company Header */}
            <div className="flex gap-4 items-center">
              <div className="bg-white dark:bg-slate-800 rounded-lg min-h-20 w-20 p-2 border">
                <img
                  alt="Stripe Logo"
                  className="object-contain w-full h-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-4fy2oTuloIiErAXBX41EUtvGT-qVPQ5L6AfEAytMrK3-5yof-xwKiNanTYVl0BbeeXlYn-K2buFddZfdfjKguTIWCBb0UHEo7K50ULIRx5e5ARiLdP3UYikwZlnhKgMzvhrKqS1Of6Qea2osV8A4-swhe_-Zsa5ZjO6shWa7D5mqnglByOdaICO3e5A3_oI9BE8AD-RdMn_gD8mg7z5wbiq7SCxMQKtVsO5r2Qx8GK5UznMH9uIE7WzqXcCbSq94zS2D4uPPUbk"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-xl font-bold">Stripe</p>
                <p className="text-base text-muted-foreground">San Francisco, CA</p>
              </div>
            </div>

            {/* Job Title & Salary */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-black leading-tight tracking-tighter">
                Senior Product Designer
              </h1>
              <p className="text-lg text-muted-foreground">
                $150,000 - $220,000 per year
              </p>
            </div>

            {/* Job Type Badges */}
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="h-8 px-3">
                Full-time
              </Badge>
              <Badge variant="secondary" className="h-8 px-3">
                Remote
              </Badge>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <Button className="w-full h-12 text-base font-bold gap-2">
                <ArrowRight className="h-5 w-5" />
                Apply Now
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-base font-bold gap-2 border-2"
              >
                <Bookmark className="h-5 w-5" />
                Save Job
              </Button>
            </div>

            {/* AI Match Card */}
            <Card className="border-accent/30 bg-accent/10 dark:bg-accent/5">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-accent-700 dark:text-accent">
                    SkillForge Analysis
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;re a <span className="font-bold">90% match</span> for this role.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Key Information Card */}
            <Card>
              <CardContent className="p-5 flex flex-col gap-4">
                <h3 className="text-lg font-bold">Key Information</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-primary shrink-0" />
                    <span>5+ Years Experience</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary shrink-0" />
                    <span>Design Team (12 members)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary shrink-0" />
                    <span>Posted 3 days ago</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column (Scrollable Details) */}
        <div className="lg:col-span-3">
          <div className="flex flex-col gap-8">
            {/* Job Details Card */}
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline">
                  <h3>About the Role</h3>
                  <p>
                    As a Senior Product Designer at Stripe, you will be responsible for leading
                    design projects from concept to launch. You&apos;ll work closely with product
                    managers, engineers, and other stakeholders to create intuitive, elegant, and
                    effective user experiences for our global customer base. We&apos;re looking for a
                    passionate and talented designer who is excited about solving complex problems
                    and building beautiful products.
                  </p>

                  <h4>Key Responsibilities</h4>
                  <ul>
                    <li>Lead the end-to-end design process for major features and new products.</li>
                    <li>Collaborate with cross-functional teams to define user problems and develop innovative solutions.</li>
                    <li>Create wireframes, prototypes, and high-fidelity mockups to communicate design ideas.</li>
                    <li>Conduct user research and usability testing to validate design decisions.</li>
                    <li>Contribute to and maintain our design system.</li>
                  </ul>

                  <h4>Qualifications</h4>
                  <ul>
                    <li>5+ years of experience in product design.</li>
                    <li>A strong portfolio showcasing your design work and process.</li>
                    <li>Proficiency in Figma, Sketch, or other design tools.</li>
                    <li>Experience working in an agile development environment.</li>
                    <li>Excellent communication and collaboration skills.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Skills Required Card */}
            <Card>
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-4">Skills Required</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "UI/UX Design",
                    "Figma",
                    "Prototyping",
                    "User Research",
                    "Design Systems",
                    "Agile Methodologies",
                    "Collaboration"
                  ].map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-accent/20 text-accent-800 dark:bg-accent/10 dark:text-accent hover:bg-accent/30 px-4 py-1.5 text-sm font-medium"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meet the Team Card */}
            <Card>
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6">Meet the Team</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    {
                      name: "Sarah Chen",
                      role: "Head of Design",
                      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQi4nkQy-f8I2R81RfYoJWR_88V2AvzrjzFw24YXqnWHHeaCRc8K6_bG1HIspY5cQulEj_a1tx7pGmkUPriiQWoygwkwNyuacPItdT9b2cEZyWDCiDof9zpNtQAchMmztnb3HCfafJGJmjJ-9fFGkG5MjaNEFg3rK00805IhD2RkVgeGbVGpukh36r1cSC7Kg6nIOzIGrxjPUB1lgbT8yJUo5g6ZPTUyls0LfvWMP2RLD9HZvQS_ianYQ-MzfMJ3Av5vHjpKZa_Ew"
                    },
                    {
                      name: "Michael Brown",
                      role: "Lead Product Manager",
                      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2K73RblqWAdgggWQSTJ-Q-ZmVMO7ODefj_zk4Q7aZ-2fntFhGxpAUzlMcdSB63o-giskdIRDgnXzc2wbXGKsIb8qos6NDqFhR8xyPsMm84zLQQ2ZGk_Q47vkkFv964AAWIppwPv24iHYGE4rWZKNY8uHy5-2VXWHTJ2_rLn2wxC7xolPldjS5dhuC5iwuRjZCmNqeAdJdMNeLARWsUhVoxKQ9Yq0xcYOnZdfEGuRIidOeD_cVMUvPOTjxk8WgeTVLPOOOFAEtWRQ"
                    },
                    {
                      name: "Emily Rodriguez",
                      role: "Senior UX Researcher",
                      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAq3E5qtJ5-DP0P_qyBb_fYzEkPiip4P4eDcv5Ewq8FWfRK5-iePjZIfUeLJpwKsyhmekcQifed1-wa9mkXc29CPzlRZHvgcgDwYxll9FaNbdRk-oFT8eUu_K5lt5vYaOOvOE_RSirTH0P00fk1t-1gxHrJXS2g_eHPEex4xutiXEk10tYOWJ89VAxAGWusmkb2UeJAmGs69IzMtYyxaZpcbfKQD63IbAfMpu5ZsxXUaqYhP5gsXn-J4Ctz0PzpUq1ssZh0yOfqCJY"
                    }
                  ].map((member) => (
                    <div key={member.name} className="flex items-center gap-4">
                      <div
                        className="h-16 w-16 rounded-full bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url('${member.image}')` }}
                      />
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
