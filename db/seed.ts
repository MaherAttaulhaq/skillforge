import { hash } from "bcryptjs";
import { db } from "./index";
import {
  users,
  categories,
  courses,
  modules,
  lessons,
  enrollments,
  lessonProgress,
  reviews,
  aiContent,
  notifications,
  userSkills,
  certificates,
  jobs,
  posts,
  comments,
} from "./schema";

async function seed() {
  console.log("🌱 Seeding SkillForge...");

  const password = await hash("password123", 10);

  /* ---------------- USERS ---------------- */
  const userData = await db
    .insert(users)
    .values([
      {
        name: "Ali Raza",
        email: "ali@example.com",
        passwordHash: password,
        role: "student",
      },
      {
        name: "Sara Khan",
        email: "sara@example.com",
        passwordHash: password,
        role: "instructor",
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        passwordHash: password,
        role: "admin",
      },
    ])
    .returning();

  const [ali, sara] = userData;

  /* ---------------- CATEGORIES ---------------- */
  const categoryData = await db
    .insert(categories)
    .values([
      { title: "Web Development", slug: "web-development" },
      { title: "Data Science", slug: "data-science" },
      { title: "AI & Machine Learning", slug: "ai-machine-learning" },
    ])
    .returning();

  const webDevCategory = categoryData[0];

  /* ---------------- COURSES ---------------- */
  const courseData = await db
    .insert(courses)
    .values([
      {
        title: "Complete JavaScript Bootcamp",
        slug: "complete-javascript-bootcamp",
        description: "Master JavaScript from beginner to advanced.",
        thumbnail: "/images/js.png",
        categoryId: webDevCategory.id,
        instructorId: sara.id,
        level: "beginner",
        price: 29.99,
      },
      {
        title: "HTML & CSS Mastery",
        slug: "html-css-mastery",
        description: "Learn modern HTML & CSS with practical projects.",
        thumbnail: "/images/css.png",
        categoryId: webDevCategory.id,
        instructorId: sara.id,
        level: "beginner",
        price: 19.99,
      },
    ])
    .returning();

  const jsCourse = courseData[0];
  const cssCourse = courseData[1];

  /* ---------------- MODULES ---------------- */
  const moduleData = await db
    .insert(modules)
    .values([
      { courseId: jsCourse.id, title: "JavaScript Basics", position: 1 },
      { courseId: jsCourse.id, title: "Functions & Scope", position: 2 },

      { courseId: cssCourse.id, title: "HTML Essentials", position: 1 },
      { courseId: cssCourse.id, title: "CSS Core Concepts", position: 2 },
    ])
    .returning();

  const jsModule1 = moduleData[0];
  const jsModule2 = moduleData[1];
  const cssModule1 = moduleData[2];
  const cssModule2 = moduleData[3];

  /* ---------------- LESSONS ---------------- */
  await db.insert(lessons).values([
    {
      moduleId: jsModule1.id,
      title: "Variables & Data Types",
      content: "Intro to var, let, const",
      position: 1,
    },
    {
      moduleId: jsModule1.id,
      title: "Operators",
      content: "Arithmetic, logical & comparison operators",
      position: 2,
    },
    {
      moduleId: jsModule2.id,
      title: "Function Declarations",
      content: "Understanding function declaration & expressions",
      position: 1,
    },

    {
      moduleId: cssModule1.id,
      title: "HTML Structure",
      content: "Understanding tags, elements, attributes",
      position: 1,
    },
    {
      moduleId: cssModule2.id,
      title: "CSS Selectors",
      content: "Learn class, id & attribute selectors",
      position: 1,
    },
  ]);

  /* ---------------- ENROLLMENTS ---------------- */
  await db.insert(enrollments).values([
    { userId: ali.id, courseId: jsCourse.id },
    { userId: ali.id, courseId: cssCourse.id },
  ]);

  /* ---------------- PROGRESS ---------------- */
  await db.insert(lessonProgress).values([
    { userId: ali.id, lessonId: 1, isCompleted: true },
    { userId: ali.id, lessonId: 2, isCompleted: false },
  ]);

  /* ---------------- REVIEWS ---------------- */
  await db.insert(reviews).values([
    {
      courseId: jsCourse.id,
      userId: ali.id,
      rating: 5,
      comment: "Amazing course! Very beginner-friendly.",
    },
    {
      courseId: cssCourse.id,
      userId: ali.id,
      rating: 4,
      comment: "Great explanations and examples.",
    },
  ]);

  /* ---------------- AI CONTENT ---------------- */
  await db.insert(aiContent).values([
    {
      userId: ali.id,
      type: "summary",
      prompt: "Explain JavaScript closures.",
      result: "A closure is a function that remembers its outer variables.",
    },
  ]);

  /* ---------------- NOTIFICATIONS ---------------- */
  await db.insert(notifications).values([
    {
      userId: ali.id,
      title: "Course Enrollment",
      message: "You enrolled in Complete JavaScript Bootcamp!",
    },
    {
      userId: ali.id,
      title: "Lesson Completed",
      message: "You completed Variables & Data Types.",
    },
  ]);

  /* ---------------- USER SKILLS ---------------- */
  await db.insert(userSkills).values([
    { userId: ali.id, skill: "JavaScript", level: "beginner" },
    { userId: ali.id, skill: "HTML", level: "intermediate" },
  ]);

  /* ---------------- CERTIFICATES ---------------- */
  await db.insert(certificates).values([
    {
      userId: ali.id,
      courseId: jsCourse.id,
      certificateUrl: "/certs/js-cert.pdf",
    },
  ]);

  /* ---------------- JOBS ---------------- */
  await db.insert(jobs).values([
    {
      title: "Senior Frontend Engineer",
      company: "Stripe",
      location: "San Francisco, CA",
      match: 92,
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOMUVhL9_7VevGCdmL2pS29udklZURm9267i2Z1FsJqVsdWxySZtMxyXkSULSsQVZKX8tScBsLe80P-tHivpGDqFWdKq3ocwLbCcpuaGcghyKacQtsgpbPZkH-rtZaJbcYDzZcmvJzfMTYmE3QkL3AJO186iAfKP2nlKnk3ALuUoYmwwXaiERPW7I7SMplAlChdt8aVtkmq-ewQmgqsS1DH7Eh-r6v5Z-iYh7CXekMFZPdYyea4Vlb-xdL0gvBaQKCHDjL2gPu5_g",
      tags: "React,TypeScript,GraphQL,Next.js",
      posted: "2 days ago",
      salary: "$150,000 - $220,000",
      type: "Full-time",
      workMode: "Remote",
      experience: "5+ Years",
      description: "As a Senior Frontend Engineer at Stripe, you will be responsible for leading frontend projects from concept to launch. You'll work closely with product managers, engineers, and other stakeholders to create intuitive, elegant, and effective user experiences for our global customer base.",
      requirements: "5+ years of experience in frontend development. Proficiency in React, TypeScript, and modern frontend tools. Experience with GraphQL and Next.js is a plus.",
      benefits: "Competitive salary, equity, health insurance, remote work options, and more."
    },
    {
      title: "Product Manager, AI",
      company: "Google",
      location: "Remote",
      match: 85,
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsiNkEz71PbqjsZTdRwqiO1e8r5ZRt-E0CXu7RZ9E2blpHawycMDxUB5T6RcZHRqoWf8GrWU9NxXr3YIX9yEozT2l87cw8ve-1lPPEYLjXxRN95VCh6LwhVnNldTRhXoy9QeY-jUnEjItuF94fHmQ_QpbDxFX86lrCeafDiI3EIZs2fxAXrSXsjDJ0KN0mysDlCOgMhOtwxIgfFHxmbGWtk-1HfjuqmT2-HqaR5w0f7oLHJoW6H1zArqjJZIbJZBiWAC1fCa9dOw0",
      tags: "Machine Learning,Product Strategy,Agile",
      posted: "5 days ago",
      salary: "$180,000 - $250,000",
      type: "Full-time",
      workMode: "Remote",
      experience: "7+ Years",
      description: "Join Google's AI team to shape the future of intelligent products. You will define product strategy, work with engineering teams to build AI-powered features, and launch products that impact millions of users.",
      requirements: "7+ years of product management experience. Strong background in AI/ML technologies. Excellent communication and leadership skills.",
      benefits: "World-class benefits, including health, dental, vision, 401k, and more."
    },
    {
      title: "UX/UI Designer",
      company: "Figma",
      location: "New York, NY",
      match: 81,
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_FsaXlvV46aVGminWUerEEDcDvkCg9tu1PcPWguA41pN3H1nYHHF_NCD0rw-Wmxf0jNVvULXS7ANC8Ba-oME_jpfN1_3ByzMtQxMU7HQzMvnPmepQP-NMq_9liYT6zlfWS95v65DLApw-qYSuwknZC5_4JrbSlWnX4N-dTQDQeThX7DgXqUskOq6J3N97Kax1nXqpeZljWydvP5R6fUeR42xx3oN6RXzaNuT-MKiJIL__c37-hZhmLOYrbISz5YLoIUyDwNF0lPI",
      tags: "Figma,User Research,Prototyping",
      posted: "1 week ago",
      salary: "$120,000 - $160,000",
      type: "Full-time",
      workMode: "On-site",
      experience: "3+ Years",
      description: "Figma is looking for a talented UX/UI Designer to join our growing team. You will design beautiful and functional interfaces, conduct user research, and collaborate with product teams to deliver exceptional user experiences.",
      requirements: "3+ years of experience in UX/UI design. Proficiency in Figma and other design tools. Strong portfolio showcasing your design process and work.",
      benefits: "Competitive salary, stock options, health benefits, and a creative work environment."
    },
    {
      title: "Data Scientist",
      company: "Shopify",
      location: "Hybrid",
      match: 78,
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBChPPlG3G5-1Bh3p4AVclBznyOSYrowStl_FwRpgj7rk2_eyNVF3Gid5XP6PzTf0WfWQibgIZnhGIFq6_84kf3fvyEljcehvtFkjDx6CA230NZrH8a7BaBG7cKBgG-0YOCij735NGibnFUM9u5zeuoUyozPHyvn0-dtaMagPAsMGvNE4iX7OD5TQALFvv3kN2IfOVWxkPyQAVHnaX0XMNcg3lZSlZm0O40ZxiZDCQTHFap8r_pgW4rkX4C7_PF4YFL58nRBpuHgVM",
      tags: "Python,SQL,Tableau,Statistics",
      posted: "3 days ago",
      salary: "$130,000 - $170,000",
      type: "Contract",
      workMode: "Hybrid",
      experience: "4+ Years",
      description: "Shopify is seeking a Data Scientist to help us make data-driven decisions. You will analyze large datasets, build predictive models, and communicate insights to stakeholders to drive business growth.",
      requirements: "4+ years of experience in data science. Proficiency in Python, SQL, and data visualization tools. Strong analytical and problem-solving skills.",
      benefits: "Flexible work arrangements, professional development opportunities, and a collaborative team culture."
    },
  ]);

  /* ---------------- POSTS ---------------- */
  const postData = await db
    .insert(posts)
    .values([
      {
        title: "How to optimize a resume for AI screening tools?",
        content:
          "I'm applying for a tech role and I've heard that many companies use AI to screen resumes. What are some key strategies to make sure my resume gets past the initial screening and is seen by a human recruiter?",
        authorId: ali.id,
      },
      {
        title: "Best practices for state management in large React applications?",
        content: `Our team's React project is growing, and we're debating best practices. Looking for real-world insights from the community.`,
        authorId: sara.id,
      },
    ])
    .returning();

  const [post1, post2] = postData;

  /* ---------------- COMMENTS ---------------- */
  await db.insert(comments).values([
    {
      content: "Great question! I'd recommend focusing on keywords from the job description.",
      postId: post1.id,
      authorId: sara.id,
    },
    {
      content: "I agree with Sara. Also, make sure your resume is in a simple, clean format that's easy for an ATS to parse.",
      postId: post1.id,
      authorId: ali.id,
    },
    {
      content: "We've had a lot of success with Zustand in our projects. It's simple and scalable.",
      postId: post2.id,
      authorId: ali.id,
    },
  ]);

  console.log("✅ Seeding completed!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
