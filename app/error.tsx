"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="container flex max-w-md flex-col items-center gap-6 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Something went wrong!
                    </h1>
                    <p className="text-muted-foreground">
                        We apologize for the inconvenience. An unexpected error has occurred.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => reset()} size="lg">
                        Try again
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/">Go Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}