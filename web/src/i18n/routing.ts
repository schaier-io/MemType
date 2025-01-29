import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = {
    // A list of all locales that are supported
    locales: ['en', 'de', 'es', 'fr'],

    // Used when no locale matches
    defaultLocale: 'de',

    // Enable static rendering
    localePrefix: 'always',

    localeDetection: false,

    // Add pathnames for static generation
    pathnames: {
        '/': '/',
        '/about': '/about'
    }
} as const;

export type AppPathnames = keyof typeof routing.pathnames;

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);