'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
    ClipboardList,
    LineChart,
    ListTodo,
    LogOut,
    Menu,
    PawPrint,
    ShieldCheck,
    X,
    Users
} from 'lucide-react'
import { useState } from 'react'

type HeaderMenuItem = {
    href: string
    label: string
    icon: LucideIcon
    iconOnly?: boolean
}

type HeaderProps = {
    title: string
    description?: string
    currentHref: string
}

const adminMenu: HeaderMenuItem[] = [
    {
        href: '/admin/tasks',
        label: 'Tasks',
        icon: ListTodo,
    },
    {
        href: '/admin/cases',
        label: 'Cases',
        icon: ClipboardList,
    },
    {
        href: '/admin/pets',
        label: 'Pets',
        icon: PawPrint,
    },
    {
        href: '/admin/people',
        label: 'People',
        icon: Users,
    },
    {
        href: '/admin/dashboard',
        label: 'Dashboard',
        icon: LineChart,
    },
    {
        href: '/auth/logout',
        label: 'Log out',
        icon: LogOut,
        iconOnly: true,
    },
]

function isActiveMenuItem(itemHref: string, currentHref: string) {
    return itemHref === currentHref
}

function getMenuItemClassName(isActive: boolean) {
    if (isActive) {
        return 'border border-2 border-primary text-primary xl:hover:scale-105 hover:brightness-105'
    }

    return 'border border-border bg-white text-foreground xl:hover:scale-105 hover:border-primary hover:bg-indigo-50'
}

export default function Header({ title, description, currentHref }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="border-b border-border bg-white">
            <div className="mx-auto max-w-screen-2xl px-4 py-5 sm:px-6 xl:px-8">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0">
                        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                            Furever Home Admin
                        </p>

                        <h1 className="mt-1 max-w-xl text-3xl font-bold text-foreground">
                            {title.length > 35 ? `${title.slice(0, 35)}...` : title}
                        </h1>

                        {description ? (
                            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{description}</p>
                        ) : null}
                    </div>

                    <nav className="hidden flex-wrap gap-3 xl:flex" aria-label="Admin page actions">
                        {adminMenu.map((item) => {
                            const Icon = item.icon
                            const isActive = isActiveMenuItem(item.href, currentHref)

                            return (
                                item.href.startsWith('/auth/') ? (
                                    <a
                                        key={item.href}
                                        data-admin-navigation-feedback="none"
                                        href={item.href}
                                        aria-label={item.iconOnly ? item.label : undefined}
                                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out ${item.iconOnly ? 'px-3' : ''} ${getMenuItemClassName(false)}`}
                                    >
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                        {item.iconOnly ? null : item.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={item.href}
                                        data-admin-navigation-feedback="none"
                                        href={item.href}
                                        aria-current={isActive ? 'page' : undefined}
                                        aria-label={item.iconOnly ? item.label : undefined}
                                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out ${item.iconOnly ? 'px-3' : ''} ${getMenuItemClassName(isActive)}`}
                                    >
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                        {item.iconOnly ? null : item.label}
                                    </Link>
                                )
                            )
                        })}
                    </nav>

                    <button
                        type="button"
                        onClick={() => setIsOpen((current) => !current)}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 self-start rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-indigo-50 xl:hidden"
                        aria-expanded={isOpen}
                        aria-label="Toggle admin menu"
                    >
                        {isOpen ? (
                            <X className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <Menu className="h-4 w-4" aria-hidden="true" />
                        )}
                        Menu
                    </button>
                </div>

                {isOpen ? (
                    <nav className="mt-4 space-y-2 xl:hidden md:max-w-1/2 lg:max-w-1/4" aria-label="Admin mobile menu">
                        {adminMenu.map((item) => {
                            const Icon = item.icon
                            const isActive = isActiveMenuItem(item.href, currentHref)

                            return (
                                item.href.startsWith('/auth/') ? (
                                    <a
                                        key={item.href}
                                        data-admin-navigation-feedback="none"
                                        href={item.href}
                                        aria-label={item.iconOnly ? item.label : undefined}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out ${getMenuItemClassName(false)}`}
                                    >
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                        {item.href.startsWith('/auth/') ? 'Sign-out' : item.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={item.href}
                                        data-admin-navigation-feedback="none"
                                        href={item.href}
                                        aria-current={isActive ? 'page' : undefined}
                                        aria-label={item.iconOnly ? item.label : undefined}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out ${getMenuItemClassName(isActive)}`}
                                    >
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                        {item.iconOnly ? null : item.label}
                                    </Link>
                                )
                            )
                        })}
                    </nav>
                ) : null}
            </div>
        </header>
    )
}