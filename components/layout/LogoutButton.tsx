"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/app/logout/actions";
import { useTransition } from "react";
import { Loader } from "lucide-react";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <Button
      className="font-semibold shadow-sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        "Logout"
      )}
    </Button>
  );
}
