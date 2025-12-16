"use client"
import { signOut } from "next-auth/react"
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import React from 'react'
import { Button } from '../ui/button'

export default function userMenu({ user }: { user: { name?: string | null; email?: string | null; image?: string | null } }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || ""} alt={user.name || ""} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={async () => await signOut()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
