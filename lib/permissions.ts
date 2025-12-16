import { UserRole } from "@/db/schema";

export const ROLES: { [key in UserRole]: string } = {
  student: "Student",
  instructor: "Instructor",
  admin: "Admin",
};

export const PERMISSIONS = {
  // Courses
  view_courses: "view_courses",
  create_courses: "create_courses",
  update_courses: "update_courses",
  delete_courses: "delete_courses",

  // Lessons
  view_lessons: "view_lessons",
  create_lessons: "create_lessons",
  update_lessons: "update_lessons",

  // Enrollments
  enroll_courses: "enroll_courses",
  view_enrollments: "view_enrollments",

  // AI Tools
  analyze_resume: "analyze_resume",
  generate_ai_content: "generate_ai_content",

  // Community
  post_question: "post_question",
  post_answer: "post_answer",
  comment: "comment",
  moderate_community: "moderate_community",

  // Admin
  manage_users: "manage_users",
  view_analytics: "view_analytics",
  track_progress: "track_progress",
};

export const ROLE_PERMISSIONS: { [key in UserRole]: string[] } = {
  student: [
    PERMISSIONS.view_courses,
    PERMISSIONS.enroll_courses,
    PERMISSIONS.view_lessons,
    PERMISSIONS.track_progress,
    PERMISSIONS.analyze_resume,
    PERMISSIONS.generate_ai_content,
    PERMISSIONS.post_question,
    PERMISSIONS.comment,
  ],
  instructor: [
    PERMISSIONS.view_courses,
    PERMISSIONS.create_courses,
    PERMISSIONS.update_courses,
    PERMISSIONS.create_lessons,
    PERMISSIONS.update_lessons,
    PERMISSIONS.view_enrollments,
    PERMISSIONS.post_answer,
  ],
  admin: Object.values(PERMISSIONS),
};
