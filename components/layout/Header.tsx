import { db } from "@/db"; 
import { getSession } from '@/lib/auth';
import { Button } from "@/components/ui/button"
import { BrainCircuit } from "lucide-react"
import React from "react"
import Link from "next/link"

export default async function Header() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { id: session.userId }
  });
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">SkillForge</h2>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <Link
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            href="/#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            href="/#how-it-works"
          >
            How it Works
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            href="/#testimonials"
          >
            Testimonials
          </Link>
        </div>

        <Link href="/register">
          <Button className="font-semibold shadow-sm">
            {user ? `Welcome, ${user.name}` : 'Register Now'}
          </Button>
        </Link>
      </div>
    </header >
  )
}
