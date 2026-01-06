import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    MapPin,
    Globe,
    Twitter,
    Github,
    Star,
    Users,
    Video,
    MessageSquare,
    Clock,
    User,
    Edit,
} from "lucide-react";

export default function InstructorProfilePage({ courses }: { courses: any[] }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Instructor Profile
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Manage your public presence and view your impact.
                    </p>
                </div>
                <Button>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                </Button>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column: Profile Info */}
                <div className="col-span-12 lg:col-span-4 xl:col-span-3">
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <Avatar className="h-32 w-32 ring-4 ring-primary/20">
                                        <AvatarImage
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcHjvgw2NcP45qzQ6xCiLfeenAjTV8z9Up-rzqlLQCqzBFRjZ9oPwo-poABdkIWN7fw0BOEq3pOtPedIoLfDTqjbm2wD4GZV1tKCRf-n1bQqdIZWF55uzhPIqNrpDEOCrGgtHpocTnIwoke6FLjHpXZoP0B6Oi9GYpiux5SQveI7Z0AonUD7AZ_JXmeHLlbIl-dd5dBNkTn53EuwASxSI8ZNE885WQaK717FQilicr_p4geNcBJbsewH05E_fe3NsrdhcQzTTzLgM"
                                            alt="Sarah Jenkins"
                                        />
                                        <AvatarFallback>SJ</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <h2 className="text-2xl font-bold">Sarah Jenkins</h2>
                                        <p className="mt-1 text-sm font-medium text-primary">
                                            Senior Technical Instructor
                                        </p>
                                        <p className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="h-4 w-4" /> San Francisco, CA
                                        </p>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-center gap-4">
                                        <a
                                            href="#"
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <Globe className="h-5 w-5" />
                                        </a>
                                        <a
                                            href="#"
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <Twitter className="h-5 w-5" />
                                        </a>
                                        <a
                                            href="#"
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <Github className="h-5 w-5" />
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">About Me</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Passionate educator with over 10 years of experience in Full
                                    Stack Development and Cloud Architecture. I love breaking down
                                    complex technical concepts into digestible, hands-on lessons. My
                                    mission is to help students bridge the gap between theory and
                                    real-world application.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Content */}
                <div className="col-span-12 lg:col-span-8 xl:col-span-9">
                    <div className="flex flex-col gap-6">
                        <div>
                            <h2 className="mb-4 text-xl font-semibold text-foreground">
                                Teaching Impact
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                                {/* Stats Card 1 */}
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between space-y-0 pb-2">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Avg. Course Rating
                                            </p>
                                            <Star className="h-5 w-5 text-accent-foreground" />
                                        </div>
                                        <div className="flex items-baseline gap-2 pt-2">
                                            <span className="text-3xl font-bold">4.9</span>
                                            <span className="text-sm text-muted-foreground">
                                                / 5.0
                                            </span>
                                        </div>
                                        <Progress value={98} className="mt-4 h-1.5" />
                                    </CardContent>
                                </Card>

                                {/* Stats Card 2 */}
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="flex flex-col p-6 h-full">
                                        <div className="flex items-center justify-between pb-2">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Total Students
                                            </p>
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="text-3xl font-bold">12,450</p>
                                        <p className="mt-auto text-xs text-muted-foreground">
                                            +850 this month
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Stats Card 3 */}
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="flex flex-col p-6 h-full">
                                        <div className="flex items-center justify-between pb-2">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Courses Taught
                                            </p>
                                            <Video className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="text-3xl font-bold">14</p>
                                        <p className="mt-auto text-xs text-muted-foreground">
                                            2 in progress
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Stats Card 4 */}
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="flex flex-col p-6 h-full">
                                        <div className="flex items-center justify-between pb-2">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Review Count
                                            </p>
                                            <MessageSquare className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="text-3xl font-bold">3.2k</p>
                                        <p className="mt-auto text-xs text-muted-foreground">
                                            Top 5% Instructor
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Courses Taught */}
                        <Card>
                            <div className="flex items-center justify-between border-b p-6">
                                <h3 className="text-lg font-semibold">Courses Taught</h3>
                                <Button variant="ghost" className="text-primary hover:text-primary/80">
                                    View All Courses
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 divide-y border-b md:grid-cols-2 md:divide-x md:divide-y-0">
                                {/* Course 1 */}
                                <div className="p-6 hover:bg-muted/50 transition-colors">
                                    <div className="mb-4 flex justify-between items-start">
                                        <Badge variant="secondary" className="bg-accent/10 text-emerald-800 hover:bg-accent/20">
                                            Bestseller
                                        </Badge>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <span className="text-sm font-bold">4.9</span>
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-xs text-muted-foreground">(1.2k)</span>
                                        </div>
                                    </div>
                                    <h4 className="mb-2 text-lg font-bold line-clamp-1">
                                        Advanced React Patterns & Performance
                                    </h4>
                                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                                        Master advanced React design patterns, performance
                                        optimization techniques, and state management strategies.
                                    </p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>12h 30m</span>
                                            <span className="mx-1">•</span>
                                            <User className="h-4 w-4" />
                                            <span>4,520 students</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Course 2 */}
                                <div className="p-6 hover:bg-muted/50 transition-colors">
                                    <div className="mb-4 flex justify-between items-start">
                                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                            New
                                        </Badge>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <span className="text-sm font-bold">5.0</span>
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-xs text-muted-foreground">(85)</span>
                                        </div>
                                    </div>
                                    <h4 className="mb-2 text-lg font-bold line-clamp-1">
                                        TypeScript for Professionals
                                    </h4>
                                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                                        A deep dive into TypeScript's type system, generics, and
                                        configuration for enterprise-scale applications.
                                    </p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>8h 15m</span>
                                            <span className="mx-1">•</span>
                                            <User className="h-4 w-4" />
                                            <span>850 students</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
                                {/* Course 3 */}
                                <div className="p-6 hover:bg-muted/50 transition-colors">
                                    <div className="mb-4 flex justify-between items-start">
                                        <Badge variant="outline">Intermediate</Badge>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <span className="text-sm font-bold">4.8</span>
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-xs text-muted-foreground">(540)</span>
                                        </div>
                                    </div>
                                    <h4 className="mb-2 text-lg font-bold line-clamp-1">
                                        Full Stack Node.js with GraphQL
                                    </h4>
                                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                                        Build scalable APIs using Node.js, Express, and GraphQL.
                                        Learn schema design and resolver optimization.
                                    </p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>18h 45m</span>
                                            <span className="mx-1">•</span>
                                            <User className="h-4 w-4" />
                                            <span>2,100 students</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Course 4 */}
                                <div className="p-6 hover:bg-muted/50 transition-colors">
                                    <div className="mb-4 flex justify-between items-start">
                                        <Badge variant="outline">Beginner</Badge>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <span className="text-sm font-bold">4.7</span>
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-xs text-muted-foreground">(2.1k)</span>
                                        </div>
                                    </div>
                                    <h4 className="mb-2 text-lg font-bold line-clamp-1">
                                        Web Development Bootcamp 2024
                                    </h4>
                                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                                        The complete guide to becoming a web developer. Covers HTML,
                                        CSS, JS, and modern frameworks.
                                    </p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>42h 00m</span>
                                            <span className="mx-1">•</span>
                                            <User className="h-4 w-4" />
                                            <span>5,300 students</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Recent Reviews */}
                        <Card>
                            <CardHeader className="border-b p-6">
                                <CardTitle className="text-lg font-semibold">
                                    Recent Reviews
                                </CardTitle>
                            </CardHeader>
                            <div className="divide-y">
                                {/* Review 1 */}
                                <div className="flex flex-col gap-3 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900">
                                                <AvatarFallback className="bg-indigo-100 text-primary dark:bg-indigo-900 dark:text-white">JD</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    John Davis
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Student • 2 days ago
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-3.5 w-3.5 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm italic text-muted-foreground">
                                        "Sarah explains complex topics with such clarity. Her React
                                        course completely changed how I approach frontend
                                        architecture. Highly recommended!"
                                    </p>
                                </div>

                                {/* Review 2 */}
                                <div className="flex flex-col gap-3 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 bg-teal-100 dark:bg-teal-900">
                                                <AvatarFallback className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100">MK</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    Maria Kornikova
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Student • 1 week ago
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex text-amber-500">
                                            {[...Array(4)].map((_, i) => (
                                                <Star key={i} className="h-3.5 w-3.5 fill-current" />
                                            ))}
                                            <Star className="h-3.5 w-3.5 text-muted-foreground/30" />
                                        </div>
                                    </div>
                                    <p className="text-sm italic text-muted-foreground">
                                        "Great content on TypeScript, although I wish there were more
                                        practice exercises on generics. Still one of the best
                                        instructors on the platform."
                                    </p>
                                </div>
                            </div>
                            <div className="border-t p-4 text-center">
                                <Button variant="ghost" className="text-primary hover:text-primary/80">
                                    View all 3,240 reviews
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
