import { getCourses } from "./actions";
import Link from "next/link";
import Image from "next/image";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
          Explore Our Courses
        </h1>
        <p className="mt-4 text-lg text-white max-w-2xl mx-auto">
          Unlock your potential with our expertly curated courses. Start your learning journey today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/details/${course.id}/${course.title}`}
            className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative w-full aspect-video bg-slate-100 overflow-hidden">
              {course.thumbnail ? (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                  <span className="text-4xl">📚</span>
                </div>
              )}
            </div>

            <div className="flex flex-col flex-1 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {course.level || "Beginner"}
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {course.price && course.price > 0
                    ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(course.price)
                    : "Free"}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {course.title}
              </h3>

              {course.description && (
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                  {course.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}