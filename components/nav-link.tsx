import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";

interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode;
  className?: string;
}

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, className, children, ...props }, ref) => {
    return (
      <Link
        href={href}
        className={cn(className)}
        ref={ref}
        {...props}
      >
        {children}
      </Link>
    );
  }
);
NavLink.displayName = "NavLink";

export { NavLink };
