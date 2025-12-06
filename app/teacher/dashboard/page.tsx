"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    PlusCircle,
    Bell,
    BrainCircuit,
    GraduationCap,
    Users,
    TrendingUp,
    Pencil,
    Trash2,
    Menu,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const courses = [
    {
        id: 1,
        name: "AI for Resume Writing",
        enrolled: 45,
        status: "Published",
        progress: 85,
    },
    {
        id: 2,
        name: "Advanced Social Learning",
        enrolled: 62,
        status: "Published",
        progress: 60,
    },
    {
        id: 3,
        name: "Intro to Web Design",
        enrolled: 18,
        status: "Draft",
        progress: 15,
    },
];

export default function TeacherDashboardPage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <BrainCircuit className="h-7 w-7 text-primary" />
                        <h2 className="text-xl font-bold tracking-tight">SkillForge</h2>
                    </div>
                    <div className="hidden items-center gap-8 md:flex">
                        <Link className="text-sm font-bold text-primary" href="/teacher/dashboard">
                            Dashboard
                        </Link>
                        <Link
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            href="/courses"
                        >
                            Courses
                        </Link>
                        <Link
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            href="/students"
                        >
                            Students
                        </Link>
                        <Link
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            href="/analysis"
                        >
                            Analytics
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button size="icon" variant="ghost" className="sm:hidden rounded-full">
                            <Menu className="h-5 w-5" />
                        </Button>
                        <Button className="hidden sm:flex font-bold" size="sm">
                            Upgrade
                        </Button>
                        <Button size="icon" variant="ghost" className="rounded-full">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Avatar>
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher" />
                            <AvatarFallback>TC</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                            Teacher Dashboard
                        </h1>
                        <p className="text-muted-foreground text-base">
                            Manage your courses, students, and analytics.
                        </p>
                    </div>
                    <Button size="lg" className="shadow-sm">
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Create New Course
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-base font-medium text-muted-foreground">
                                        Total Courses
                                    </h3>
                                    <p className="text-3xl font-bold">12</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-cyan-500/10 text-cyan-500">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-base font-medium text-muted-foreground">
                                        Total Students
                                    </h3>
                                    <p className="text-3xl font-bold">284</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-base font-medium text-muted-foreground">
                                        Avg. Completion
                                    </h3>
                                    <p className="text-3xl font-bold">76%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* My Courses */}
                <div className="flex flex-col gap-6 mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">My Courses</h2>
                    <Card>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Course Name</TableHead>
                                        <TableHead className="hidden sm:table-cell">Enrolled</TableHead>
                                        <TableHead className="hidden md:table-cell">Status</TableHead>
                                        <TableHead className="hidden lg:table-cell">Progress</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courses.map((course) => (
                                        <TableRow key={course.id}>
                                            <TableCell className="font-medium">{course.name}</TableCell>
                                            <TableCell className="hidden sm:table-cell text-muted-foreground">
                                                {course.enrolled}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {course.status === "Published" ? (
                                                    <Badge variant="default" className="bg-cyan-500 hover:bg-cyan-600">
                                                        Published
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">Draft</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <Progress value={course.progress} className="w-full" />
                                                    <span className="text-sm font-medium text-muted-foreground min-w-[45px]">
                                                        {course.progress}%
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-500"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>

                {/* Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 w-full flex items-center justify-center bg-muted/50 rounded-lg">
                                <svg className="text-xs text-muted-foreground" height="100%" viewBox="0 0 400 200" width="100%">
                                    {/* Y-axis */}
                                    <line stroke="currentColor" strokeDasharray="2" strokeWidth="0.5" x1="40" x2="40" y1="20" y2="170" />
                                    <text fill="currentColor" textAnchor="end" x="35" y="25">100</text>
                                    <line stroke="currentColor" strokeDasharray="2" strokeWidth="0.5" x1="40" x2="380" y1="57.5" y2="57.5" />
                                    <text fill="currentColor" textAnchor="end" x="35" y="62.5">75</text>
                                    <line stroke="currentColor" strokeDasharray="2" strokeWidth="0.5" x1="40" x2="380" y1="95" y2="95" />
                                    <text fill="currentColor" textAnchor="end" x="35" y="100">50</text>
                                    <line stroke="currentColor" strokeDasharray="2" strokeWidth="0.5" x1="40" x2="380" y1="132.5" y2="132.5" />
                                    <text fill="currentColor" textAnchor="end" x="35" y="137.5">25</text>
                                    <text fill="currentColor" textAnchor="end" x="35" y="175">0</text>
                                    {/* X-axis */}
                                    <line stroke="currentColor" strokeWidth="1" x1="40" x2="380" y1="170" y2="170" />
                                    <text fill="currentColor" textAnchor="middle" x="80" y="185">Jan</text>
                                    <text fill="currentColor" textAnchor="middle" x="140" y="185">Feb</text>
                                    <text fill="currentColor" textAnchor="middle" x="200" y="185">Mar</text>
                                    <text fill="currentColor" textAnchor="middle" x="260" y="185">Apr</text>
                                    <text fill="currentColor" textAnchor="middle" x="320" y="185">May</text>
                                    {/* Line chart */}
                                    <polyline className="stroke-primary" fill="none" points="80,110 140,80 200,95 260,60 320,40" strokeWidth="2" />
                                    <circle className="fill-primary" cx="80" cy="110" r="3" />
                                    <circle className="fill-primary" cx="140" cy="80" r="3" />
                                    <circle className="fill-primary" cx="200" cy="95" r="3" />
                                    <circle className="fill-primary" cx="260" cy="60" r="3" />
                                    <circle className="fill-primary" cx="320" cy="40" r="3" />
                                </svg>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Course Engagement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 w-full flex items-center justify-center bg-muted/50 rounded-lg">
                                <svg className="text-xs text-muted-foreground" height="100%" viewBox="0 0 400 200" width="100%">
                                    {/* Axes */}
                                    <line stroke="currentColor" strokeWidth="1" x1="40" x2="40" y1="20" y2="170" />
                                    <line stroke="currentColor" strokeWidth="1" x1="40" x2="380" y1="170" y2="170" />
                                    {/* Labels */}
                                    <text fill="currentColor" textAnchor="middle" x="95" y="185">Course A</text>
                                    <text fill="currentColor" textAnchor="middle" x="205" y="185">Course B</text>
                                    <text fill="currentColor" textAnchor="middle" x="315" y="185">Course C</text>
                                    {/* Bars */}
                                    <rect className="fill-primary/80" height="97.5" width="50" x="70" y="72.5" />
                                    <rect className="fill-primary/60" height="135" width="50" x="180" y="35" />
                                    <rect className="fill-cyan-500/70" height="60" width="50" x="290" y="110" />
                                </svg>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
