"use client";

import { useState, useActionState } from "react";
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
import { PlusCircle, X, Upload, Save, Eye, Sparkles } from "lucide-react";
import { createCourse } from "./actions";

interface Lesson {
  id: string;
  title: string;
  content: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

const initialState = {
  message: "",
  errors: {},
};

interface Category {
  id: number;
  title: string;
}

interface CreateCourseFormProps {
  categories: Category[];
}

export function CreateCourseForm({ categories }: CreateCourseFormProps) {
  // @ts-ignore
  const [state, formAction] = useActionState(createCourse, initialState);
  const [modules, setModules] = useState<Module[]>([
    {
      id: "1",
      title: "",
      description: "",
      lessons: [{ id: "1", title: "", content: "" }],
    },
  ]);

  const addModule = () => {
    setModules([
      ...modules,
      {
        id: Date.now().toString(),
        title: "",
        description: "",
        lessons: [{ id: Date.now().toString(), title: "", content: "" }],
      },
    ]);
  };

  const removeModule = (id: string) => {
    if (modules.length > 1) {
      setModules(modules.filter((module) => module.id !== id));
    }
  };

  const addLesson = (moduleId: string) => {
    const newModules = modules.map((m) => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [
            ...m.lessons,
            { id: Date.now().toString(), title: "", content: "" },
          ],
        };
      }
      return m;
    });
    setModules(newModules);
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    const newModules = modules.map((m) => {
      if (m.id === moduleId) {
        if (m.lessons.length > 1) {
          return {
            ...m,
            lessons: m.lessons.filter((l) => l.id !== lessonId),
          };
        }
      }
      return m;
    });
    setModules(newModules);
  };

  return (
    <form action={formAction}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="course-title">Course Title</Label>
                <Input
                  id="course-title"
                  name="title"
                  placeholder="e.g., Introduction to Web Design"
                />
                {state.errors?.title && (
                  <div className="text-red-500 text-sm">
                    {state.errors.title}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="course-category">Category</Label>
                  <Select name="category">
                    <SelectTrigger id="course-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty-level">Difficulty Level</Label>
                  <Select name="level">
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
              {state.message && (
                <div className="text-red-500 text-sm">{state.message}</div>
              )}
            </CardContent>
          </Card>
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
                  name="description"
                  placeholder="Describe the key skills and knowledge students will gain from this course."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Modules</h3>
                <Button variant="outline" size="sm" onClick={addModule}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </div>
              {modules.map((module, moduleIndex) => (
                <div
                  key={module.id}
                  className="flex flex-col gap-4 p-4 rounded-lg border bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder={`Module ${moduleIndex + 1}: Title`}
                      value={module.title}
                      onChange={(e) => {
                        const newModules = [...modules];
                        newModules[moduleIndex].title = e.target.value;
                        setModules(newModules);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeModule(module.id)}
                      disabled={modules.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Module description..."
                    rows={2}
                    value={module.description}
                    onChange={(e) => {
                      const newModules = [...modules];
                      newModules[moduleIndex].description = e.target.value;
                      setModules(newModules);
                    }}
                  />
                  <div className="pl-4 border-l-2 border-primary/20 space-y-4">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder={`Lesson ${lessonIndex + 1}: Title`}
                            value={lesson.title}
                            onChange={(e) => {
                              const newModules = [...modules];
                              newModules[moduleIndex].lessons[
                                lessonIndex
                              ].title = e.target.value;
                              setModules(newModules);
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLesson(module.id, lesson.id)}
                            disabled={module.lessons.length <= 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Lesson content..."
                          rows={3}
                          value={lesson.content}
                          onChange={(e) => {
                            const newModules = [...modules];
                            newModules[moduleIndex].lessons[
                              lessonIndex
                            ].content = e.target.value;
                            setModules(newModules);
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addLesson(module.id)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="sticky top-28 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="submit" className="w-full" size="lg">
                  <Upload className="h-5 w-5 mr-2" />
                  Publish Course
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  variant="outline"
                  size="lg"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Draft
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  variant="ghost"
                  size="lg"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  Preview
                </Button>
              </CardContent>
            </Card>

            <p aria-live="polite" className="sr-only" role="status">
              {state?.message}
            </p>
          </div>
        </div>
      </div>
      <input type="hidden" name="modules" value={JSON.stringify(modules)} />
    </form>
  );
}
