import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="container flex max-w-md flex-col items-center gap-6 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <FileQuestion className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        404
                    </h1>
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Page not found
                    </h2>
                    <p className="text-muted-foreground">
                        Sorry, we couldnt find the page youre looking for. It might have been removed, renamed, or doesnt exist.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button asChild size="lg">
                        <Link href="/">Go Home</Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/contact">Contact Support</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}