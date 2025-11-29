import Link from "next/link"
import { Facebook, Twitter, Linkedin, Github } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="container mx-auto max-w-6xl px-4 py-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                            Product
                        </h3>
                        <Link
                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                            href="/#features"
                        >
                            Features
                        </Link>
                        <Link
                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                            href="#"
                        >
                            Pricing
                        </Link>
                        <Link
                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                            href="/#testimonials"
                        >
                            Testimonials
                        </Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                            Company
                        </h3>
                        <Link
                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                            href="#"
                        >
                            About Us
                        </Link>
                        <Link
                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                            href="#"
                        >
                            Blog
                        </Link>
                        <Link
                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                            href="#"
                        >
                            Contact
                        </Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                            Legal
                        </h3>
                        <Link
                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                            href="#"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                            href="#"
                        >
                            Terms of Service
                        </Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                            Connect
                        </h3>
                        <div className="flex gap-4">
                            <Link
                                className="text-muted-foreground transition-colors hover:text-primary"
                                href="#"
                            >
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link
                                className="text-muted-foreground transition-colors hover:text-primary"
                                href="#"
                            >
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link
                                className="text-muted-foreground transition-colors hover:text-primary"
                                href="#"
                            >
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-sm text-muted-foreground">
                    <p>© 2024 SkillForge. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
