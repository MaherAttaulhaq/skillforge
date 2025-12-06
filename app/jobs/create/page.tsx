"use client";

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
    Sparkles,
    Bell,
    BrainCircuit,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function CreateJobListingPage() {
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
                            href="/jobs/create"
                        >
                            Post a Job
                        </Link>
                        <Link
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            href="/applicants"
                        >
                            Applicants
                        </Link>
                        <Link
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            href="/company"
                        >
                            Company Profile
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button size="icon" variant="ghost" className="rounded-full">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Avatar>
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=employer" />
                            <AvatarFallback>EM</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                        Create a New Job Listing
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Fill in the details below to post a job and find your next great hire.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Form Fields */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {/* Job Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="job-title">Job Title</Label>
                                    <Input
                                        id="job-title"
                                        placeholder="e.g., Senior Product Manager"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            placeholder="e.g., San Francisco, CA or Remote"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="job-type">Job Type</Label>
                                        <Select>
                                            <SelectTrigger id="job-type">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="full-time">Full-time</SelectItem>
                                                <SelectItem value="part-time">Part-time</SelectItem>
                                                <SelectItem value="contract">Contract</SelectItem>
                                                <SelectItem value="internship">Internship</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="job-description">Job Description</Label>
                                    <Textarea
                                        id="job-description"
                                        placeholder="Describe the role, responsibilities, and what makes it a great opportunity."
                                        rows={6}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="job-requirements">Requirements</Label>
                                    <Textarea
                                        id="job-requirements"
                                        placeholder="List the key skills, qualifications, and experience required."
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Application Process */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Application Process</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="apply-email">Application Email</Label>
                                        <Input
                                            id="apply-email"
                                            type="email"
                                            placeholder="hr@yourcompany.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="apply-url">
                                            External Application URL (Optional)
                                        </Label>
                                        <Input
                                            id="apply-url"
                                            type="url"
                                            placeholder="https://yourcompany.com/careers/apply"
                                        />
                                    </div>
                                </div>
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
                                        Publish Job
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
                                                AI Suggestion
                                            </h3>
                                            <p className="text-sm text-cyan-800 dark:text-cyan-200">
                                                Refine your job description for better reach.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="link"
                                        className="w-full text-primary dark:text-cyan-400 font-bold"
                                    >
                                        Optimize with AI
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
