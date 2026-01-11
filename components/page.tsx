import { db } from "@/lib/db";
import InstructorProfilePage from "@/components/instructor-dashboard";
import { redirect } from "next/navigation";

export default async function InstructorPage() {
    // 1. Fetch the data from the database
    // In a real app, you would get the logged-in user's ID from the session
    // const session = await auth();
    // const userId = session?.user?.id;

    const instructorData = await db.user.findFirst({
        where: {
            email: "sarah.jenkins@example.com", // Replace with dynamic user ID
        },
        include: {
            instructorProfile: true,
            courses: {
                take: 4,
                orderBy: { createdAt: 'desc' }
            },
            reviews: {
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: true
                }
            }
        }
    });

    if (!instructorData || !instructorData.instructorProfile) {
        // Handle case where profile doesn't exist
        return <div className="p-8">Instructor profile not found.</div>;
    }

    const courses = instructorData.courses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description || "",
        rating: 4.9, // Placeholder
        reviewCount: "1.2k", // Placeholder
        duration: "12h 30m", // Placeholder
        students: "4,520", // Placeholder
        badge: "Bestseller", // Logic to determine badge
        badgeVariant: "secondary" as const,
        badgeClass: "bg-accent/10 text-emerald-800 hover:bg-accent/20",
    }));

    // 3. Pass the prepared data to the presentation component
    return (
        <InstructorProfilePage
            courses={courses}
        />
    );
}