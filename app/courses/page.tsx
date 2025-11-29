import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Signal, BookOpen, BarChart, ChevronLeft, ChevronRight } from "lucide-react"

export default function CoursesPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <aside className="w-full lg:w-1/4 xl:w-1/5 space-y-8">
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold tracking-tight">Categories</h3>
                        <div className="space-y-3">
                            {[
                                { id: "web-dev", label: "Web Development", checked: true },
                                { id: "ai-ml", label: "AI/ML", checked: false },
                                { id: "data-science", label: "Data Science", checked: true },
                                { id: "design", label: "Design", checked: false },
                                { id: "devops", label: "DevOps", checked: false },
                            ].map((category) => (
                                <div key={category.id} className="flex items-center space-x-3">
                                    <Checkbox id={category.id} defaultChecked={category.checked} />
                                    <Label
                                        htmlFor={category.id}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    >
                                        {category.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold tracking-tight">Difficulty Level</h3>
                        <RadioGroup defaultValue="all">
                            {[
                                { id: "all", label: "All Levels" },
                                { id: "beginner", label: "Beginner" },
                                { id: "intermediate", label: "Intermediate" },
                                { id: "advanced", label: "Advanced" },
                            ].map((level) => (
                                <div key={level.id} className="flex items-center space-x-3">
                                    <RadioGroupItem value={level.id} id={level.id} />
                                    <Label
                                        htmlFor={level.id}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    >
                                        {level.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    <Button className="w-full font-semibold shadow-sm">
                        Apply Filters
                    </Button>
                </aside>
                <div className="flex-1">
                    <div className="mb-8 space-y-2">
                        <h1 className="text-4xl font-black tracking-tighter sm:text-5xl">Explore Courses</h1>
                        <p className="text-muted-foreground max-w-2xl">
                            Discover your next skill. Browse our extensive catalog of courses designed to propel your career forward.
                        </p>
                    </div>
                    <div className="mb-6 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                        <Button variant="default" className="rounded-full h-9 px-4 text-sm font-semibold">
                            All
                        </Button>
                        {["Web Development", "AI/ML", "Data Science", "Design"].map((cat) => (
                            <Button
                                key={cat}
                                variant="outline"
                                className="rounded-full h-9 px-4 text-sm font-medium text-muted-foreground hover:text-foreground bg-card"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Advanced Tailwind CSS",
                                level: "Intermediate",
                                chapters: 15,
                                progress: 75,
                                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2-6Waw0dlrZE6daCg7cfNROHp6QKqE_Uub1V1U7KHxezaQ7-LbMz77u5k1lf1jAU1J28EkECTuVwoq745fihbra0Xz_1FMoVUUdd4tN7v4MSu8f__uwSqITj3iJaYalaN2crN7JjxaJGQ-5iJSus6tQ4pJUGqMFGYfyrfHLnylq5CtaE4lcNZZJNbFglfhY8hqaPI70pDR4IWJGP3RvLKPdaJO_OThu8HA3KqKMR_TV9hJ4ooLcen06cahzKgOfY1zX3Y6BIgu3U",
                                icon: Signal
                            },
                            {
                                title: "Introduction to React",
                                level: "Beginner",
                                chapters: 12,
                                progress: 0,
                                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9Jm0Zs9NE7CMyncHNlltye8o5FgVH5uW3Kb3tPoGdEYxeGFyuzGwbsEczdJsmaLELmozBCtt9Kwx2X8nVY77UPbi86KRjjgiubC6E70j4sx6Ct9eVhHKizB5EKwWFBwXQ7rYvEW2lCRI0KFhk8LEJ0gvm3vBd1WN_YXgLPFLbk7YnTnyqA9RT8F8V2myCOPiq--DShHs9ejrVGumM9oYB_kUKCR-N3dF_4zej7fn5elrL9BU7XViiK8dmjFrfFNJcmmBna3gW2Vc",
                                icon: BarChart
                            },
                            {
                                title: "Machine Learning Foundations",
                                level: "Advanced",
                                chapters: 20,
                                progress: 25,
                                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfTTUFYbkSM2mCM8fPQhxKb-xZ-1K-I6iRwDUpihEdPrsnCSjSxnaFL3p8SJt91CU5IWsNDyrwA8boGSFHGI2FFj_scOF_I3YMDYlUIkcTVaf_5uyhVq0rkdiebbCanrdqtbpFeEZ0vkEJ8msscTwAasVCm7Sj-1GsDDyX8Rq1lMQX1iekDAfeQ8UEPHixlrjNyU16YKMj-_rDf04Dl9njuMCeHKtZwmjrYkkX5u4wdoO0bSYzE9kJju9ZMcvAc9qOOlft5uMQjr8",
                                icon: Signal
                            },
                            {
                                title: "Data Visualization with D3.js",
                                level: "Intermediate",
                                chapters: 18,
                                progress: 10,
                                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnI_JFb4XflbxWBQAyUQ5_WnCDHBJ4k43WNQUaXVFY_YEjuoQtX312xOtrF_NUjF6ds5AQKgGY9QFL9M7VpAsdvg1z1753PsIkpmWTuny1VcA3pCw8p1Y_Ps_7SZJSCaZo5iIWtYHemDx8JIrxOu3-I-quVClwqIDhtSGRYyKAnhwUz7HyroxPKo5hOWGHrWOmS7wvJcSdnBrLB2jRVcHjJ4nmGk9Jy4iXRhgNyCtxK7T0EvoDoYEkTgvGIZdn7xuxO5GayGJN4fU",
                                icon: BarChart
                            },
                            {
                                title: "UI/UX Design Principles",
                                level: "Beginner",
                                chapters: 10,
                                progress: 50,
                                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBb8d6c1sW0Aa1CoS3WxFxB4ZGY8c5cFCa1g76iccgP13Xt-S4BBy0uHkHUxPZOfxN7j14fQwDHuh3sCZJLvEiilTKjULE59HeBMoQqo9GjUzkswp6jfpW_I6X2tmlTU3svrvabSMeG_pjyKZX7zfIPF5giadipK-N15NEKMlZoRF_uTJn8BUZ1fAXoTOAxtj254yEnbQlTVv2ZHmaJzGiNQPNTxiYD8I5-ak5fqJUKXPO3B9lFxXWoksVricl8cKjn_Sl898ziPhk",
                                icon: BarChart
                            },
                            {
                                title: "Python for Data Science",
                                level: "Beginner",
                                chapters: 22,
                                progress: 90,
                                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUSMFDiPSENJ-GDKVjTjP_OCWL8p_zdjWmD4G2cfwThhdMduR5yrC8s1kWfxI_k2T2zWJEFnbpM56xyE6vLAAbnu1RAmRd5GKmzhk3FqHTDLTMMP-kyjD1JH0BMKAs8KXQ8wd2vbfUvEX2edXWdO-FOt0MGz83fK8jvuwDXJN1Fe0enViPlQ3j6KFNXP5bJu5oillLJOphhKro8RWRIu8W3c7gPOK8nqfLb66xZK3zCMEkX_H4jEheJsioBocPM9gEd7iNdGZZYuE",
                                icon: BarChart
                            }
                        ].map((course, index) => (
                            <Card key={index} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="relative w-full aspect-video overflow-hidden">
                                    <div
                                        className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-300 group-hover:scale-105"
                                        style={{ backgroundImage: `url("${course.image}")` }}
                                    ></div>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-lg font-semibold flex-grow mb-2 leading-tight">
                                        {course.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <course.icon className="h-4 w-4" />
                                            <span>{course.level}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <BookOpen className="h-4 w-4" />
                                            <span>{course.chapters} Chapters</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2 mb-4">
                                        <div className="bg-accent h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                    <Button className="w-full font-semibold">
                                        Start Learning
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <div className="flex items-center justify-center mt-12 gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button variant="default" size="icon" className="h-9 w-9 font-bold">
                            1
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 font-medium text-muted-foreground hover:bg-secondary">
                            2
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 font-medium text-muted-foreground hover:bg-secondary">
                            3
                        </Button>
                        <span className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">...</span>
                        <Button variant="ghost" size="icon" className="h-9 w-9 font-medium text-muted-foreground hover:bg-secondary">
                            8
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 font-medium text-muted-foreground hover:bg-secondary">
                            9
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 font-medium text-muted-foreground hover:bg-secondary">
                            10
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
