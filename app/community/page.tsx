import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, PlusCircle, ThumbsUp, MessageSquare, Share2, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-extrabold tracking-tight">
                                    Community Forum
                                </h1>
                                <p className="text-muted-foreground">
                                    Ask questions, share knowledge, and connect with peers.
                                </p>
                            </div>
                            <Button className="gap-2 shadow-sm transition-transform duration-200 ease-in-out hover:scale-105">
                                <PlusCircle className="h-4 w-4" />
                                Create Post
                            </Button>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                <Button variant="default" className="rounded-full h-9 px-4 text-sm font-medium">
                                    All Posts
                                </Button>
                                {["Interview Tips", "React", "AI", "Career Advice"].map((tag) => (
                                    <Button
                                        key={tag}
                                        variant="ghost"
                                        className="rounded-full h-9 px-4 text-sm font-medium bg-card hover:bg-accent hover:text-accent-foreground"
                                    >
                                        {tag}
                                    </Button>
                                ))}
                            </div>
                            <Button variant="outline" className="gap-2 h-9 px-3 text-sm font-medium bg-card">
                                <span>Sort by: Latest</span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Card className="shadow-sm transition-shadow duration-200 hover:shadow-md">
                                <CardContent className="p-4 flex flex-col gap-4">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuABAoWKf-acZDPOjvGcNp-muT5wCxuNtadY9Kd7bTdcHcsNp6ZauudHMYJifck_0ohlt-ZwMxz5zxdVuCSL9Q6AeHhgxf__X_sxV0aKv2r-o6fWjAeSkll1TafYkTKAQspo6wxeWDT-jYMCe3ROtT3o1RibD9eTxu4sj8Aq1kFN4I7dVWH-gXn_QroDpGWMUkPQK4QNQrm7ni15L4NCLBP53KqwMZFX3hXDsCRqmvplg_stSodXlkQVzxBRq8Skq9jTiCISKxslnCU" alt="Sarah Johnson" />
                                            <AvatarFallback>SJ</AvatarFallback>
                                        </Avatar>
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <h3 className="text-lg font-semibold tracking-tight">
                                                How to optimize a resume for AI screening tools?
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Posted by Sarah Johnson, 2 hours ago
                                            </p>
                                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                                I&apos;m applying for a tech role and I&apos;ve heard that many companies use AI to screen resumes. What are some key strategies to make sure my resume gets past the initial screening and is seen by a human recruiter?
                                            </p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {["AI", "Resume", "Career Advice"].map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="bg-indigo-100 text-primary dark:bg-indigo-900/50 dark:text-indigo-300 hover:bg-indigo-200">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t pt-3">
                                        <div className="flex gap-4">
                                            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary group">
                                                <ThumbsUp className="h-4 w-4 transition-transform group-hover:scale-110" />
                                                <span>12</span>
                                            </Button>
                                            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary group">
                                                <MessageSquare className="h-4 w-4 transition-transform group-hover:scale-110" />
                                                <span>5</span>
                                            </Button>
                                        </div>
                                        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary group">
                                            <Share2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm transition-shadow duration-200 hover:shadow-md">
                                <CardContent className="p-4 flex flex-col gap-4">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLLYq49BHJ0aY66rQbdzYQQtq7TEeqPlMmQJIk_Hm2hJPoog7-7RUGSQqmqVHjYogv4ZmrSkV9HyjtELradCuhAUc-qQ_wixIltQqBXfGpFqpg50gpW_W72c68oS2wWbS__R9-K2kVGFIvNENwNVjc7mHaWgH-Dg9m_7EUUTwGk7_MJtgb9Y0XAR-vO2wl5my5hEupjLbbtRHNfkqzFbUtKGe7_wiuXy-KiYZLmXyaP_nATswMzAx5UEdf9pykjIS1e7BcguzJzVU" alt="David Lee" />
                                            <AvatarFallback>DL</AvatarFallback>
                                        </Avatar>
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <h3 className="text-lg font-semibold tracking-tight">
                                                Best practices for state management in large React applications?
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Posted by David Lee, 1 day ago
                                            </p>
                                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                                Our team&apos;s React project is growing, and we&apos;re debating between Redux, MobX, and Zustand for state management. What are the pros and cons of each in a large-scale application? Looking for real-world insights.
                                            </p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <Badge variant="secondary" className="bg-indigo-100 text-primary dark:bg-indigo-900/50 dark:text-indigo-300 hover:bg-indigo-200">
                                                    React
                                                </Badge>
                                                <Badge variant="secondary" className="bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-accent hover:bg-teal-200">
                                                    Popular
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t pt-3">
                                        <div className="flex gap-4">
                                            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary group">
                                                <ThumbsUp className="h-4 w-4 transition-transform group-hover:scale-110" />
                                                <span>48</span>
                                            </Button>
                                            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary group">
                                                <MessageSquare className="h-4 w-4 transition-transform group-hover:scale-110" />
                                                <span>21</span>
                                            </Button>
                                        </div>
                                        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary group">
                                            <Share2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm transition-shadow duration-200 hover:shadow-md">
                                <CardContent className="p-4 flex flex-col gap-4">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7RW1MnLMKD545trhyuXz0XL0CKk5z0JhSuQrt-fjBgTmKzq8CJHlx8bIx1-GTfUo8LWA0RY0fgtIL_unQ0-c6YwtYuyLldfgrgBcExI8ihV4SO48sa6T8xRYC7SnyyfghD4ZzHtQkTjtK0rc-xERzdt4Fy4Illr-hKjRoR5aigXtHrrbMx4xC25BSLIXA6C-YizQZwxjAqNlkIpSj03O1alqaTE37813WgCeX5eVsghpkTIOxj3MnX1RNVV1zIz-oTGt6xKvpLJs" alt="Emily Chen" />
                                            <AvatarFallback>EC</AvatarFallback>
                                        </Avatar>
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <h3 className="text-lg font-semibold tracking-tight">
                                                Common Behavioral Questions in FAANG Interviews
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Posted by Emily Chen, 3 days ago
                                            </p>
                                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                                I have a final round interview coming up and I want to be prepared for the behavioral questions. Can anyone share some common ones and how to best structure answers using the STAR method?
                                            </p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <Badge variant="secondary" className="bg-indigo-100 text-primary dark:bg-indigo-900/50 dark:text-indigo-300 hover:bg-indigo-200">
                                                    Interview Tips
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t pt-3">
                                        <div className="flex gap-4">
                                            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary group">
                                                <ThumbsUp className="h-4 w-4 transition-transform group-hover:scale-110" />
                                                <span>32</span>
                                            </Button>
                                            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary group">
                                                <MessageSquare className="h-4 w-4 transition-transform group-hover:scale-110" />
                                                <span>15</span>
                                            </Button>
                                        </div>
                                        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary group">
                                            <Share2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <aside className="col-span-12 hidden lg:col-span-4 lg:block">
                    <div className="sticky top-24 flex flex-col gap-6">
                        <Card className="shadow-sm">
                            <CardContent className="p-4">
                                <h4 className="mb-4 text-base font-semibold tracking-tight">Trending Tags</h4>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { tag: "#resume-tips", count: "215 posts" },
                                        { tag: "#reactjs", count: "189 posts" },
                                        { tag: "#ai-tools", count: "154 posts" },
                                        { tag: "#interviewprep", count: "121 posts" },
                                        { tag: "#career-growth", count: "98 posts" }
                                    ].map((item) => (
                                        <Link
                                            key={item.tag}
                                            className="flex justify-between text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                                            href="#"
                                        >
                                            <span>{item.tag}</span>
                                            <span>{item.count}</span>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm">
                            <CardContent className="p-4">
                                <h4 className="mb-4 text-base font-semibold tracking-tight">Top Contributors</h4>
                                <div className="flex flex-col gap-4">
                                    {[
                                        { name: "Alex Martinez", contributions: "128 contributions", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH0s6MFWgjY1T2kLBVSvIA7WA4FWi9hXo8nBFyd4WBiuXl3TYdQvOM5eJScUUeXIfmf5jAXJi-1zTrd-SlXpdeuVhtqurjIeT3gtDU06yKFLBOUjAtFI0CVCwdZhUAYm-GZmI--lgALn7WI9zaNkaQG7s_Y74of612wm-8gh-HUPyBpa8p05mvOZU1y7gieQdDNp8utnxoP7OI4hqJqiH5V3-9zz2gN3DRG89PRL3Wji8LZL726eqB5UNsZdGLt_xc8wuBFD3tJ1E", fallback: "AM" },
                                        { name: "Maria Garcia", contributions: "102 contributions", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5kgTpS71Ynb33_4-A7OG9nFNDt3FvaU7zaWAPu8YHo9ju8KdFqblT8B32JGblIE36cU8rts-_QyR5pbRl0G9tGX3_dNNDcU6HSe10-pXyw7sNPcJDj4HxkN5ltbTOO2wUCa_7mdESeXR-G6XPBc7eVGICkKHSmw9soXppm5ignPBNcbId1QphMMz5HDrogZnq-0VG43jWjYKdHOb2ttd-xlbBRfM3ELGtNCw0LbUHtm4g6315i-necVSZVH9bxqbW3bXza-icIgA", fallback: "MG" },
                                        { name: "James Brown", contributions: "89 contributions", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUr0gySwZjWjR9lVaTmp42kZKygvrF5ULmi4KlKsF8N_M18Ift4EHP1hUxu1FxDoaZz4qUnCo3OxRMVRJxwDwGsBS2tNkV6fk9gVyO-KPKJ2KrWYx8A9fDAHWbvH-J7hhOtc7P36flEDwx2Z1ZWRINNowNv7KBWnxmfsmM3K4p_r5LcwypopK1jpk3ZoEtb9yDyq3cBGtKvPbQ9dd9DcZv0-P2GhJYXmUQlzk6TYGs081WLT-42zMpaHqxMDpmbod0TUv-lb4mb6w", fallback: "JB" }
                                    ].map((contributor) => (
                                        <div key={contributor.name} className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={contributor.img} alt={contributor.name} />
                                                <AvatarFallback>{contributor.fallback}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold tracking-tight">{contributor.name}</p>
                                                <p className="text-xs text-muted-foreground">{contributor.contributions}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </aside>
            </div>
        </div>
    )
}
