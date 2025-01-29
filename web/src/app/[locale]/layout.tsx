import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { getMessages } from 'next-intl/server';
import { Metadata } from 'next';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

// Metadata generator function
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const paramsResolved = await params;
    const messages = (await getMessages({ locale: paramsResolved.locale })) as any

    return {
        title: {
            template: '%s | MemType',
            default: 'MemType - Memory Typing Game',
        },
        description: messages.metadata?.description || 'Train your memory and typing skills with MemType - a fun and challenging memory typing game',
        keywords: ['memory game', 'typing game', 'brain training', 'educational game', 'typing practice'],
        authors: [{ name: 'MemType' }],
        openGraph: {
            title: 'MemType - Memory Typing Game',
            description: messages.metadata?.description || 'Train your memory and typing skills with MemType',
            type: 'website',
            locale: paramsResolved.locale,
        },
        twitter: {
            card: 'summary_large_image',
            title: 'MemType - Memory Typing Game',
            description: messages.metadata?.description || 'Train your memory and typing skills with MemType',
        },
        icons: {
            icon: '/favicon.ico',
            apple: '/apple-touch-icon.png',
        },
        manifest: '/site.webmanifest',
        // Add viewport settings
        viewport: {
            width: 'device-width',
            initialScale: 1,
            maximumScale: 1,
        },
    };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) {

    const paramsResolved = await params;
    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(paramsResolved.locale as any)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(paramsResolved.locale);

    const messages = await getMessages({ locale: paramsResolved.locale });


    return (
        <html lang={paramsResolved.locale} suppressHydrationWarning>

            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextIntlClientProvider messages={messages} locale={paramsResolved.locale}>
                        <Navbar />
                        {children}
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
} 