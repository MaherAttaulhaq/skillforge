import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, MapPin, Clock } from "lucide-react"

export default function JobsPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-1/4 lg:max-w-xs shrink-0">
                    <div className="sticky top-28">
                        <Card className="shadow-sm">
                            <CardContent className="p-6 flex flex-col gap-6">
                                <h3 className="text-lg font-bold">Filters</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search by title, skill..." className="pl-9" />
                                </div>
                                <div className="flex flex-col">
                                    <Accordion type="single" collapsible defaultValue="role" className="w-full">
                                        <AccordionItem value="role" className="border-b-0">
                                            <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium">Role</AccordionTrigger>
                                            <AccordionContent>
                                                <div className="flex flex-col gap-3 pt-2">
                                                    {["Software Engineer", "Product Manager", "Data Scientist", "UX/UI Designer"].map((role) => (
                                                        <div key={role} className="flex items-center space-x-3">
                                                            <Checkbox id={role} />
                                                            <label htmlFor={role} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                {role}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="experience" className="border-b-0 border-t">
                                            <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium">Experience Level</AccordionTrigger>
                                            <AccordionContent>
                                                <div className="flex flex-col gap-3 pt-2">
                                                    {["Entry Level", "Mid Level", "Senior Level"].map((level) => (
                                                        <div key={level} className="flex items-center space-x-3">
                                                            <Checkbox id={level} />
                                                            <label htmlFor={level} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                {level}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="location" className="border-b-0 border-t">
                                            <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium">Location</AccordionTrigger>
                                            <AccordionContent>
                                                <div className="flex flex-col gap-3 pt-2">
                                                    {["Remote", "Hybrid", "On-site"].map((loc) => (
                                                        <div key={loc} className="flex items-center space-x-3">
                                                            <Checkbox id={loc} />
                                                            <label htmlFor={loc} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                {loc}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                                <div className="flex flex-col gap-2 pt-4 border-t">
                                    <Button className="w-full">Apply Filters</Button>
                                    <Button variant="ghost" className="w-full">Clear All</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </aside>
                <div className="w-full lg:w-3/4">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-4xl font-black tracking-tight">Recommended Jobs</h1>
                            <p className="text-base text-muted-foreground">
                                Based on your profile, here are jobs that match your skills.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: "Senior Frontend Engineer",
                                    company: "Stripe",
                                    location: "San Francisco, CA",
                                    match: 92,
                                    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOMUVhL9_7VevGCdmL2pS29udklZURm9267i2Z1FsJqVsdWxySZtMxyXkSULSsQVZKX8tScBsLe80P-tHivpGDqFWdKq3ocwLbCcpuaGcghyKacQtsgpbPZkH-rtZaJbcYDzZcmvJzfMTYmE3QkL3AJO186iAfKP2nlKnk3ALuUoYmwwXaiERPW7I7SMplAlChdt8aVtkmq-ewQmgqsS1DH7Eh-r6v5Z-iYh7CXekMFZPdYyea4Vlb-xdL0gvBaQKCHDjL2gPu5_g",
                                    tags: ["React", "TypeScript", "GraphQL", "Next.js"],
                                    posted: "2 days ago"
                                },
                                {
                                    title: "Product Manager, AI",
                                    company: "Google",
                                    location: "Remote",
                                    match: 85,
                                    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsiNkEz71PbqjsZTdRwqiO1e8r5ZRt-E0CXu7RZ9E2blpHawycMDxUB5T6RcZHRqoWf8GrWU9NxXr3YIX9yEozT2l87cw8ve-1lPPEYLjXxRN95VCh6LwhVnNldTRhXoy9QeY-jUnEjItuF94fHmQ_QpbDxFX86lrCeafDiI3EIZs2fxAXrSXsjDJ0KN0mysDlCOgMhOtwxIgfFHxmbGWtk-1HfjuqmT2-HqaR5w0f7oLHJoW6H1zArqjJZIbJZBiWAC1fCa9dOw0",
                                    tags: ["Machine Learning", "Product Strategy", "Agile"],
                                    posted: "5 days ago"
                                },
                                {
                                    title: "UX/UI Designer",
                                    company: "Figma",
                                    location: "New York, NY",
                                    match: 81,
                                    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_FsaXlvV46aVGminWUerEEDcDvkCg9tu1PcPWguA41pN3H1nYHHF_NCD0rw-Wmxf0jNVvULXS7ANC8Ba-oME_jpfN1_3ByzMtQxMU7HQzMvnPmepQP-NMq_9liYT6zlfWS95v65DLApw-qYSuwknZC5_4JrbSlWnX4N-dTQDQeThX7DgXqUskOq6J3N97Kax1nXqpeZljWydvP5R6fUeR42xx3oN6RXzaNuT-MKiJIL__c37-hZhmLOYrbISz5YLoIUyDwNF0lPI",
                                    tags: ["Figma", "User Research", "Prototyping"],
                                    posted: "1 week ago"
                                },
                                {
                                    title: "Data Scientist",
                                    company: "Shopify",
                                    location: "Hybrid",
                                    match: 78,
                                    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBChPPlG3G5-1Bh3p4AVclBznyOSYrowStl_FwRpgj7rk2_eyNVF3Gid5XP6PzTf0WfWQibgIZnhGIFq6_84kf3fvyEljcehvtFkjDx6CA230NZrH8a7BaBG7cKBgG-0YOCij735NGibnFUM9u5zeuoUyozPHyvn0-dtaMagPAsMGvNE4iX7OD5TQALFvv3kN2IfOVWxkPyQAVHnaX0XMNcg3lZSlZm0O40ZxiZDCQTHFap8r_pgW4rkX4C7_PF4YFL58nRBpuHgVM",
                                    tags: ["Python", "SQL", "Tableau", "Statistics"],
                                    posted: "3 days ago"
                                }
                            ].map((job, index) => (
                                <Card key={index} className="flex flex-col shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-200">
                                    <CardContent className="p-6 flex flex-col gap-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="h-12 w-12 rounded-lg bg-center bg-no-repeat bg-cover p-1 border"
                                                    style={{ backgroundImage: `url('${job.logo}')` }}
                                                ></div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{job.title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {job.company} • {job.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xl font-bold text-accent">{job.match}%</p>
                                                <p className="text-xs font-medium text-muted-foreground">Match</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {job.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t mt-auto">
                                            <p className="text-sm text-muted-foreground">Posted {job.posted}</p>
                                            <Button className="h-9 px-4 font-bold">Apply Now</Button>
                                        </div>
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
