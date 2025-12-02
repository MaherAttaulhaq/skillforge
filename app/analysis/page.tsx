import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Lightbulb, ChevronDown } from "lucide-react";
import { db } from "@/db";
import { users, userSkills } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function AnalysisPage() {
    // Fetch current user (using first student for demo)
    const currentUser = await db
        .select()
        .from(users)
        .where(eq(users.role, "student"))
        .limit(1)
        .get();

    // Fetch user skills
    const skills = currentUser
        ? await db
            .select()
            .from(userSkills)
            .where(eq(userSkills.userId, currentUser.id))
        : [];

    // Calculate ATS score based on skills
    const atsScore =
        skills.length > 0
            ? Math.min(95, 65 + skills.length * 5)
            : 70;

    // Separate skills by level for gaps analysis
    const expertSkills = skills.filter((s) => s.level === "expert");
    const intermediateSkills = skills.filter((s) => s.level === "intermediate");
    const beginnerSkills = skills.filter((s) => s.level === "beginner");

    // Identify skill gaps (beginner level skills or suggest new skills)
    const skillGaps =
        beginnerSkills.length > 0
            ? beginnerSkills.slice(0, 3).map((s) => s.skill)
            : ["Advanced Analytics", "Leadership", "Strategic Planning"];

    // Generate AI summary based on user data
    const aiSummary = currentUser
        ? `${currentUser.name} is a dedicated professional with ${skills.length} key skills in their portfolio. ${expertSkills.length > 0
            ? `Demonstrates expertise in ${expertSkills.map((s) => s.skill).join(", ")}.`
            : ""
        } ${skills.length > 5
            ? "Strong technical foundation with diverse skill set."
            : "Building a solid foundation for career growth."
        }`
        : "Professional with a growing skill set and commitment to continuous learning.";

    // Calculate stroke offset for circular progress (88 is circumference, offset = 88 - (88 * atsScore/100))
    const strokeOffset = 88 - (88 * atsScore) / 100;

    return (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                    Analyze Your Resume
                </h1>
                <p className="text-muted-foreground text-base font-normal leading-normal">
                    Get instant AI feedback to improve your job application.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="relative flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-border px-6 py-14 bg-card shadow-sm transition-all duration-300 hover:border-primary hover:shadow-lg group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl"></div>
                        <div className="z-10 flex flex-col items-center gap-4 text-center">
                            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 text-primary">
                                <Upload className="h-8 w-8" />
                            </div>
                            <p className="text-lg font-bold tracking-tight">
                                Drag & drop your resume here
                            </p>
                            <p className="text-muted-foreground text-sm font-normal">
                                Please upload a PDF file to get started.
                            </p>
                        </div>
                        <Button variant="outline" className="z-10 rounded-full font-bold">
                            Browse Files
                        </Button>
                    </div>
                    <div className="flex justify-start">
                        <Button
                            className="w-full lg:w-auto rounded-full h-12 px-6 text-base font-bold tracking-wide"
                            disabled
                        >
                            Analyze Resume
                        </Button>
                    </div>
                </div>
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Analysis Results
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Card className="shadow-sm">
                            <CardContent className="p-6 flex flex-col gap-4">
                                <h3 className="text-base font-semibold">
                                    ATS Compatibility Score
                                </h3>
                                <div className="flex items-center justify-center">
                                    <div className="relative h-36 w-36">
                                        <svg className="h-full w-full" viewBox="0 0 36 36">
                                            <circle
                                                className="stroke-current text-muted"
                                                cx="18"
                                                cy="18"
                                                fill="none"
                                                r="16"
                                                strokeWidth="3"
                                            ></circle>
                                            <circle
                                                className="stroke-current text-primary"
                                                cx="18"
                                                cy="18"
                                                fill="none"
                                                r="16"
                                                strokeDasharray="88"
                                                strokeDashoffset={strokeOffset}
                                                strokeLinecap="round"
                                                strokeWidth="3"
                                                transform="rotate(-90 18 18)"
                                            ></circle>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-3xl font-bold text-primary">
                                                {atsScore}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm">
                            <CardContent className="p-6 flex flex-col gap-4">
                                <h3 className="text-base font-semibold">
                                    AI-Generated Summary
                                </h3>
                                <p className="text-sm text-muted-foreground">{aiSummary}</p>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="shadow-sm">
                        <CardContent className="p-6 flex flex-col gap-4">
                            <h3 className="text-base font-semibold">Your Key Skills</h3>
                            {skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <Badge
                                            key={skill.id}
                                            variant="secondary"
                                            className="bg-primary/10 text-primary hover:bg-primary/20"
                                        >
                                            {skill.skill}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No skills added yet. Add skills to improve your analysis.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-6 flex flex-col gap-4">
                            <h3 className="text-base font-semibold">
                                Identified Skill Gaps
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skillGaps.map((gap) => (
                                    <Badge
                                        key={gap}
                                        variant="secondary"
                                        className="gap-1.5 bg-accent/20 text-teal-800 dark:text-accent hover:bg-accent/30"
                                    >
                                        <Lightbulb className="h-4 w-4" />
                                        {gap}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-6 flex flex-col gap-4">
                            <h3 className="text-base font-semibold">
                                Actionable Suggestions
                            </h3>
                            <div className="flex flex-col gap-2">
                                {[
                                    {
                                        title: "Quantify Your Achievements",
                                        content:
                                            'Instead of "Increased user engagement," try "Increased user engagement by 25% in Q3 by implementing a new onboarding flow." Using specific metrics makes your impact more tangible and impressive.',
                                    },
                                    {
                                        title: "Strengthen Action Verbs",
                                        content:
                                            'Replace passive phrases like "Responsible for..." with strong action verbs like "Spearheaded," "Architected," or "Optimized." This demonstrates ownership and proactivity.',
                                    },
                                    {
                                        title: "Expand Your Skill Set",
                                        content: `Consider adding skills like ${skillGaps.join(", ")} to your resume. ${skills.length < 5
                                                ? "Having more diverse skills will improve your ATS score and job matches."
                                                : "These skills are highly valued in your field."
                                            }`,
                                    },
                                ].map((suggestion, index) => (
                                    <details
                                        key={index}
                                        className="group rounded-lg border border-border bg-muted/30 transition-all duration-300 open:bg-primary/5 open:border-primary/50"
                                    >
                                        <summary className="flex cursor-pointer items-center justify-between p-4 list-none transition-colors duration-300 hover:bg-muted/50">
                                            <span className="font-medium">{suggestion.title}</span>
                                            <ChevronDown className="h-4 w-4 transition-transform duration-300 group-open:rotate-180 text-muted-foreground" />
                                        </summary>
                                        <div className="px-4 pb-4 text-sm text-muted-foreground">
                                            {suggestion.content}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
