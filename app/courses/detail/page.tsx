import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, PlayCircle, Play, ChevronRight, Download, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function CourseDetailPage() {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 xl:col-span-9">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-wrap gap-2 text-sm font-medium text-muted-foreground">
                            <Link href="#" className="hover:text-primary">My Courses</Link>
                            <span>/</span>
                            <Link href="#" className="hover:text-primary">Web Development Path</Link>
                            <span>/</span>
                            <span className="text-foreground">Advanced Tailwind CSS</span>
                        </div>
                        <div className="flex flex-wrap justify-between items-start gap-4">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight">
                                    Introduction to Utility-First
                                </h1>
                                <p className="text-base font-normal text-muted-foreground">
                                    Master responsive design and advanced utility-first concepts to build modern web interfaces.
                                </p>
                            </div>
                            <Button className="gap-2 shadow-sm">
                                <CheckCircle className="h-4 w-4" />
                                Mark as Complete
                            </Button>
                        </div>
                        <div>
                            <div className="relative flex items-center justify-center bg-black aspect-video rounded-xl overflow-hidden shadow-lg group">
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-40 transition-opacity"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_xI6DPYAuJ4qEWATzUhkb4xAAGrwi4gKDoNlXyuG10XEmHxW0YrJWb4Vvyq8Izum4rddv-KQqGJqpQVFj0kmBAc7v3NdoqSqPaXkWdY531aJ_LN-AAFJJ__z_lDTe4HZIMT9Kut-Ji3fydMU0iVF2_rlyaLn4Vq9pWzcjP9bJDE78SPsc-ZfQfYSWMdQlXx1JMbSoaJYkaQg2_lSVyeDLmxCiZ4IqqlNKeJFWmJ-ns65QrdyK0bDzz0QOhwsq_6w3ltDHDw3RHZM")' }}
                                ></div>
                                <Button size="icon" className="h-16 w-16 rounded-full bg-primary/90 text-white hover:bg-primary z-10">
                                    <Play className="h-8 w-8 ml-1" />
                                </Button>
                                <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="relative flex h-4 items-center justify-center group/progress">
                                        <div className="h-1.5 w-full rounded-full bg-white/30">
                                            <div className="h-1.5 rounded-full bg-accent" style={{ width: '25%' }}></div>
                                        </div>
                                        <div className="absolute h-3 w-3 rounded-full bg-white shadow transition-transform group-hover/progress:scale-110" style={{ left: '25%' }}></div>
                                    </div>
                                    <div className="flex items-center justify-between mt-1 text-white text-xs font-medium">
                                        <span>2:37</span>
                                        <span>10:14</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="border-b">
                                <nav className="-mb-px flex space-x-6">
                                    <Link href="#" className="border-b-2 border-primary py-3 px-1 text-sm font-medium text-primary">
                                        Overview
                                    </Link>
                                    <Link href="#" className="border-b-2 border-transparent py-3 px-1 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border">
                                        Q&A
                                    </Link>
                                    <Link href="#" className="border-b-2 border-transparent py-3 px-1 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border">
                                        My Notes
                                    </Link>
                                </nav>
                            </div>
                            <div className="py-6">
                                <div className="prose dark:prose-invert max-w-none">
                                    <h3 className="text-lg font-bold">About this lesson</h3>
                                    <p className="text-muted-foreground">
                                        In this lesson, we dive deep into the core philosophy of Tailwind CSS: utility-first. You&apos;ll learn how this approach differs from traditional CSS frameworks and how it can drastically speed up your development workflow. We will cover the fundamentals of applying utilities, the benefits of constraints, and how to build complex components without writing a single line of custom CSS.
                                    </p>
                                    <h4 className="text-md font-bold mt-4">Resources</h4>
                                    <ul className="list-none pl-0 space-y-2">
                                        <li>
                                            <Link href="#" className="flex items-center gap-2 text-primary hover:underline">
                                                <Download className="h-4 w-4" />
                                                Downloadable Source Code (.zip)
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="flex items-center gap-2 text-primary hover:underline">
                                                <ExternalLink className="h-4 w-4" />
                                                Tailwind CSS Official Documentation
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
                    <Card className="sticky top-24 shadow-sm">
                        <CardContent className="p-4 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-4 justify-between items-center">
                                    <p className="text-sm font-bold">Course Progress</p>
                                    <p className="text-sm font-medium text-primary">45%</p>
                                </div>
                                <Progress value={45} className="h-2" />
                            </div>
                            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                                <AccordionItem value="item-1" className="border-b-0">
                                    <AccordionTrigger className="hover:no-underline py-2">
                                        <div className="flex flex-col items-start gap-1 text-left">
                                            <span className="font-bold text-sm">1. Getting Started</span>
                                            <span className="text-xs text-muted-foreground font-normal">4/5 lessons ･ 48m</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary">
                                                <PlayCircle className="h-5 w-5 shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">Introduction to Utility-First</span>
                                                    <span className="text-xs opacity-80">10:14</span>
                                                </div>
                                            </Link>
                                            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted text-muted-foreground">
                                                <CheckCircle className="h-5 w-5 shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">Setting up Your Environment</span>
                                                    <span className="text-xs opacity-80">12:30</span>
                                                </div>
                                            </Link>
                                            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted text-muted-foreground">
                                                <CheckCircle className="h-5 w-5 shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">Core Concepts</span>
                                                    <span className="text-xs opacity-80">15:02</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2" className="border-b-0">
                                    <AccordionTrigger className="hover:no-underline py-2">
                                        <div className="flex flex-col items-start gap-1 text-left">
                                            <span className="font-bold text-sm">2. Responsive Design</span>
                                            <span className="text-xs text-muted-foreground font-normal">0/4 lessons ･ 55m</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="p-2 text-sm text-muted-foreground">Content for Responsive Design...</div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3" className="border-b-0">
                                    <AccordionTrigger className="hover:no-underline py-2">
                                        <div className="flex flex-col items-start gap-1 text-left">
                                            <span className="font-bold text-sm">3. Advanced Techniques</span>
                                            <span className="text-xs text-muted-foreground font-normal">0/6 lessons ･ 1h 15m</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="p-2 text-sm text-muted-foreground">Content for Advanced Techniques...</div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    )
}
