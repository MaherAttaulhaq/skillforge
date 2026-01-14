import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button"
import { BrainCircuit } from "lucide-react"
import Link from "next/link"
import UserMenu from "./user-menu";
import { NavLink } from "../nav-link";

export default async function Header() {
  const session = await auth();
  const user = session?.user;

  async function handleSignOut() {
    "use server"
    await signOut({ redirectTo: "/register" });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <NavLink href="/">
            <h2 className="text-xl font-bold tracking-tight">SkillForge</h2>
          </NavLink>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <Link
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            href="/courses"
          >
            Courses
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            href="/jobs"
          >
            Jobs
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            href="/community"
          >
            Community
          </Link>
        </div>

        <div>
          {user ?
            <UserMenu user={user} onSignOut={handleSignOut} />
            :
            <Link href="/register">
              <Button className="font-semibold shadow-sm">
                 Sign up
              </Button>
            </Link>
          }
        </div>
      </div>
    </header >
  )
}
