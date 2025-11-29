import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, ArrowUpRight } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <p className="text-3xl sm:text-4xl font-black leading-tight tracking-tight min-w-72">
                        Welcome back, Alex!
                    </p>
                    <div className="flex gap-3 flex-wrap justify-start">
                        <Button className="gap-2 shadow-sm">
                            <Upload className="h-5 w-5" />
                            Upload New Resume
                        </Button>
                        <Button variant="outline" className="gap-2 shadow-sm bg-card hover:bg-accent">
                            <FileText className="h-5 w-5" />
                            Analyze Job Description
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-9 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="shadow-md transition-shadow hover:shadow-lg hover:-translate-y-1">
                                <CardContent className="p-6 flex flex-col gap-2">
                                    <p className="text-base font-medium text-muted-foreground">ATS Score</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-primary text-4xl font-bold leading-tight">85</p>
                                        <p className="text-muted-foreground text-lg font-medium">/ 100</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-md transition-shadow hover:shadow-lg hover:-translate-y-1">
                                <CardContent className="p-6 flex flex-col gap-2">
                                    <p className="text-base font-medium text-muted-foreground">Average Job Match</p>
                                    <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden mt-4">
                                        <div className="absolute h-full bg-accent rounded-full" style={{ width: '78%' }}></div>
                                    </div>
                                    <p className="text-teal-500 text-4xl font-bold leading-tight mt-2 self-end">78%</p>
                                </CardContent>
                            </Card>
                            <Card className="shadow-md transition-shadow hover:shadow-lg hover:-translate-y-1">
                                <CardContent className="p-6 flex flex-col gap-2">
                                    <p className="text-base font-medium text-muted-foreground">Top Skill Gap</p>
                                    <span className="inline-block mt-4 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 font-semibold px-3 py-1.5 rounded-full text-lg">
                                        Project Management
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight mb-4">Recommended Courses</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[
                                    { category: "PROJECT MANAGEMENT", title: "Agile & Scrum Fundamentals", description: "Master the essentials of agile development and scrum practices to boost your project management skills." },
                                    { category: "DATA ANALYSIS", title: "Python for Data Science", description: "Learn to use Python with Pandas, NumPy, and Matplotlib for powerful data analysis and visualization." },
                                    { category: "COMMUNICATION", title: "Effective Public Speaking", description: "Build confidence and learn techniques to deliver compelling presentations to any audience." }
                                ].map((course, index) => (
                                    <Card key={index} className="flex flex-col shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                                        <CardContent className="p-6 flex flex-col gap-4 h-full">
                                            <span className="text-sm font-semibold text-primary tracking-wider uppercase">{course.category}</span>
                                            <h4 className="text-lg font-bold">{course.title}</h4>
                                            <p className="text-sm text-muted-foreground flex-grow">{course.description}</p>
                                            <Button variant="link" className="p-0 h-auto font-bold text-primary self-start">View Course</Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                    <aside className="col-span-12 lg:col-span-3">
                        <div className="sticky top-24 space-y-6">
                            <Card className="shadow-md">
                                <CardContent className="p-6 flex flex-col gap-2">
                                    <p className="text-base font-medium">Skill Analysis</p>
                                    <p className="text-3xl font-bold leading-tight truncate">Overall Score: 82%</p>
                                    <div className="flex gap-1">
                                        <p className="text-sm font-normal text-muted-foreground">This Month</p>
                                        <p className="text-green-600 dark:text-green-400 text-sm font-medium">+5.2%</p>
                                    </div>
                                    <div className="grid min-h-[180px] grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center px-2 pt-4">
                                        <div className="bg-primary rounded-t w-full transition-all duration-300 hover:bg-primary/80" style={{ height: '80%' }}></div>
                                        <p className="text-xs font-bold text-muted-foreground">Technical</p>
                                        <div className="bg-accent rounded-t w-full transition-all duration-300 hover:bg-accent/80" style={{ height: '65%' }}></div>
                                        <p className="text-xs font-bold text-muted-foreground">Soft</p>
                                        <div className="bg-primary rounded-t w-full transition-all duration-300 hover:bg-primary/80" style={{ height: '40%' }}></div>
                                        <p className="text-xs font-bold text-muted-foreground">Mgmt</p>
                                        <div className="bg-accent rounded-t w-full transition-all duration-300 hover:bg-accent/80" style={{ height: '70%' }}></div>
                                        <p className="text-xs font-bold text-muted-foreground">Design</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </aside>
                    <div className="col-span-12">
                        <h3 className="text-2xl font-bold tracking-tight mb-4">Recommended Jobs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[
                                { title: "Senior Product Manager", company: "Innovate Inc. • San Francisco, CA", match: 92, topMatch: true },
                                { title: "UX/UI Designer", company: "Creative Solutions • Remote", match: 85, topMatch: false },
                                { title: "Data Analyst", company: "DataDriven Co. • New York, NY", match: 81, topMatch: false }
                            ].map((job, index) => (
                                <Card key={index} className="flex flex-col shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                                    <CardContent className="p-6 flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-lg font-bold">{job.title}</h4>
                                                <p className="text-sm text-muted-foreground">{job.company}</p>
                                            </div>
                                            {job.topMatch && (
                                                <Badge variant="secondary" className="bg-accent text-teal-900 hover:bg-accent/80">Top Match</Badge>
                                            )}
                                        </div>
                                        <div className="text-center bg-primary/10 text-primary font-bold p-2 rounded-lg">
                                            Match Score: {job.match}%
                                        </div>
                                        <Button className={job.topMatch ? "" : "bg-card text-foreground border hover:bg-accent"}>
                                            {job.topMatch ? "Apply Now" : "View Job"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
