"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Upload,
    Save,
    Eye,
    PlusCircle,
    Sparkles,
    Bell,
    BrainCircuit
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Module {
    id: string;
    title: string;
    description: string;
}

export default function CreateCoursePage() {
    const [modules, setModules] = useState<Module[]>([
        { id: "1", title: "", description: "" },
        { id: "2", title: "", description: "" },
    ]);

    const addModule = () => {
        const newModule: Module = {
            id: Date.now().toString(),
            title: "",
            description: "",
        };
        setModules([...modules, newModule]);
    };

    const removeModule = (id: string) => {
        if (modules.length > 1) {
            setModules(modules.filter((module) => module.id !== id));
        }
    };

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
                        <Link
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            href="/dashboard"
                        >
                            Dashboard
                        </Link>
                        <Link
                            className="text-sm font-bold text-primary"
                            href="/courses/create"
                        >
                            Create a Course
                        </Link>
                        <Link
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            href="/courses"
                        >
                            My Courses
                        </Link>
                        <Link
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            href="/profile"
                        >
                            My Profile
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
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
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                        Create a New Course
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Fill in the details below to create your course and start teaching.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Form Fields */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {/* Course Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="course-title">Course Title</Label>
                                    <Input
                                        id="course-title"
                                        placeholder="e.g., Introduction to Web Design"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="course-category">Category</Label>
                                        <Select>
                                            <SelectTrigger id="course-category">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="technology">Technology</SelectItem>
                                                <SelectItem value="business">Business</SelectItem>
                                                <SelectItem value="creative">Creative Arts</SelectItem>
                                                <SelectItem value="health">Health & Wellness</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="difficulty-level">Difficulty Level</Label>
                                        <Select>
                                            <SelectTrigger id="difficulty-level">
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="beginner">Beginner</SelectItem>
                                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                                <SelectItem value="advanced">Advanced</SelectItem>
                                                <SelectItem value="all">All Levels</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Course Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="course-description">
                                        What will students learn?
                                    </Label>
                                    <Textarea
                                        id="course-description"
                                        placeholder="Describe the key skills and knowledge students will gain from this course. Use bullet points for clarity."
                                        rows={6}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Course Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Content</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {modules.map((module, index) => (
                                    <div
                                        key={module.id}
                                        className="flex flex-col gap-4 p-4 rounded-lg border bg-muted/50"
                                    >
                                        <Input
                                            placeholder={`Module ${index + 1}: Title (e.g., Getting Started)`}
                                            value={module.title}
                                            onChange={(e) => {
                                                const newModules = [...modules];
                                                newModules[index].title = e.target.value;
                                                setModules(newModules);
                                            }}
                                        />
                                        <Textarea
                                            placeholder="Module description..."
                                            rows={3}
                                            value={module.description}
                                            onChange={(e) => {
                                                const newModules = [...modules];
                                                newModules[index].description = e.target.value;
                                                setModules(newModules);
                                            }}
                                        />
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={addModule}
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Module
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="sticky top-28 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button className="w-full" size="lg">
                                        <Upload className="h-5 w-5 mr-2" />
                                        Publish Course
                                    </Button>
                                    <Button className="w-full" variant="outline" size="lg">
                                        <Save className="h-5 w-5 mr-2" />
                                        Save Draft
                                    </Button>
                                    <Button className="w-full" variant="ghost" size="lg">
                                        <Eye className="h-5 w-5 mr-2" />
                                        Preview
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-cyan-200 bg-cyan-50/50 dark:border-cyan-800 dark:bg-cyan-950/20">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-cyan-500 text-cyan-950">
                                            <Sparkles className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-cyan-900 dark:text-cyan-100">
                                                AI Assistant
                                            </h3>
                                            <p className="text-sm text-cyan-800 dark:text-cyan-200">
                                                Generate engaging course content with AI.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="link"
                                        className="w-full text-primary dark:text-cyan-400 font-bold"
                                    >
                                        Generate with AI
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
