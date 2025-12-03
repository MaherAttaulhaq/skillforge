import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { submitForm } from "@/app/actions/form";
import { Verified, Award, FileText, GraduationCap } from "lucide-react";
// import { useRef } from "react";

export default function ProfilePage() {
    // let ref = useRef<HTMLFormElement>(null);
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 xl:col-span-3">
            <div className="flex flex-col gap-6">
              <Card className="shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                      <AvatarImage
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcHjvgw2NcP45qzQ6xCiLfeenAjTV8z9Up-rzqlLQCqzBFRjZ9oPwo-poABdkIWN7fw0BOEq3pOtPedIoLfDTqjbm2wD4GZV1tKCRf-n1bQqdIZWF55uzhPIqNrpDEOCrGgtHpocTnIwoke6FLjHpXZoP0B6Oi9GYpiux5SQveI7Z0AonUD7AZ_JXmeHLlbIl-dd5dBNkTn53EuwASxSI8ZNE885WQaK717FQilicr_p4geNcBJbsewH05E_fe3NsrdhcQzTTzLgM"
                        alt="Alex Doe"
                      />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-card bg-accent text-white">
                      <Verified className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xl font-bold tracking-tight">Alex Doe</p>
                    <p className="text-sm text-muted-foreground">
                      Senior Software Engineer
                    </p>
                  </div>
                  <Button className="w-full">Edit Profile</Button>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    My Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "JavaScript",
                      "React",
                      "Node.js",
                      "TypeScript",
                      "Tailwind CSS",
                      "SQL",
                    ].map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {["Project Management", "Agile Methodologies"].map(
                      (skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-accent/10 text-accent hover:bg-accent/20"
                        >
                          {skill}
                        </Badge>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight mb-4">
                  Dashboard Statistics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  <Card className="shadow-sm">
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                          Overall ATS Score
                        </p>
                        <Award className="h-5 w-5 text-accent" />
                      </div>
                      <div className="relative h-24 w-24 mx-auto flex items-center justify-center">
                        <svg className="h-full w-full" viewBox="0 0 36 36">
                          <circle
                            className="stroke-current text-muted/20"
                            cx="18"
                            cy="18"
                            fill="none"
                            r="16"
                            strokeWidth="3"
                          ></circle>
                          <circle
                            className="stroke-current text-accent transition-all duration-500"
                            cx="18"
                            cy="18"
                            fill="none"
                            r="16"
                            strokeDasharray="100"
                            strokeDashoffset="12"
                            strokeLinecap="round"
                            strokeWidth="3"
                            transform="rotate(-90 18 18)"
                          ></circle>
                        </svg>
                        <p className="absolute text-2xl font-bold text-accent">
                          88%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-6 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                          Resumes Analyzed
                        </p>
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-4xl font-bold tracking-tight">12</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-6 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                          Courses Completed
                        </p>
                        <GraduationCap className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-4xl font-bold tracking-tight">7</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-6 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                          Skill Badges Earned
                        </p>
                        <Award className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-4xl font-bold tracking-tight">15</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <Card className="shadow-sm">
                <CardHeader className="p-6 border-b">
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    Completed Courses & Badges
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-6 py-3">
                          Course Title
                        </TableHead>
                        <TableHead className="px-6 py-3">
                          Completion Date
                        </TableHead>
                        <TableHead className="px-6 py-3 text-right">
                          Certificate
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          title: "Advanced React Patterns",
                          date: "2023-11-15",
                        },
                        {
                          title: "TypeScript for Professionals",
                          date: "2023-09-02",
                        },
                        {
                          title: "Modern CSS with Tailwind",
                          date: "2023-07-21",
                        },
                        {
                          title: "Data Structures & Algorithms",
                          date: "2023-05-10",
                        },
                      ].map((course, index) => (
                        <TableRow key={index}>
                          <TableCell className="px-6 py-4 font-medium">
                            {course.title}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-muted-foreground">
                            {course.date}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <Button
                              variant="link"
                              className="text-primary font-medium p-0 h-auto"
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}