"use client";

import { Tabs } from "@/components/ui/tabs";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function ProfileTabs({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    params.delete("page"); // Reset page when switching tabs
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs
      value={defaultValue}
      onValueChange={onValueChange}
      className={className}
    >
      {children}
    </Tabs>
  );
}
