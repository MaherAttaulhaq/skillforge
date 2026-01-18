"use client";

import { Button } from "@/components/ui/button";
import { Award, Download } from "lucide-react";

interface CertificateViewProps {
  studentName: string;
  courseTitle: string;
  completionDate: Date;
}

export function CertificateView({
  studentName,
  courseTitle,
  completionDate,
}: CertificateViewProps) {
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 flex flex-col items-center gap-8 min-h-screen bg-muted/10">
      <div className="flex gap-4 print:hidden w-full max-w-4xl justify-end">
        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download / Print
        </Button>
      </div>

      <div className="w-full max-w-5xl aspect-[1.414/1] relative bg-white text-black shadow-2xl print:shadow-none print:w-full print:h-full print:absolute print:top-0 print:left-0 print:m-0 overflow-hidden rounded-lg">
        <div className="absolute inset-0 border-[16px] border-double border-primary/20 pointer-events-none z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Award className="w-96 h-96" />
        </div>

        <div className="flex flex-col items-center justify-between h-full p-16 sm:p-24 text-center relative z-0">
          <div className="space-y-6">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-primary tracking-wider uppercase">
              Certificate
            </h1>
            <h2 className="text-xl sm:text-2xl font-serif text-muted-foreground uppercase tracking-[0.2em]">
              of Completion
            </h2>
          </div>

          <div className="space-y-6 w-full max-w-3xl my-8">
            <p className="text-lg sm:text-xl text-muted-foreground font-light">
              This is to certify that
            </p>
            <p className="text-3xl sm:text-5xl font-bold text-foreground font-serif italic py-4 border-b border-border/50">
              {studentName}
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground font-light pt-4">
              has successfully completed the course
            </p>
            <h3 className="text-2xl sm:text-4xl font-bold text-primary font-serif">
              {courseTitle}
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-end w-full max-w-3xl gap-8 sm:gap-0 mt-auto">
            <div className="flex flex-col items-center gap-2">
              <p className="font-medium text-lg">
                {completionDate.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="w-48 h-px bg-black/20"></div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Date
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <p className="font-serif italic text-2xl text-primary">
                SkillForge
              </p>
              <div className="w-48 h-px bg-black/20"></div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Instructor Signature
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          body > *:not(.container) {
            display: none;
          }
          .container {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
