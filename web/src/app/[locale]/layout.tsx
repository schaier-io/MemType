import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { getMessages } from 'next-intl/server';

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


export default async function LocaleLayout({ children, params }: { children: React.ReactNode, params: any }) {
    console.log(params)
    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(params.locale as any)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(params.locale);

    const messages = await getMessages(params.locale);

    return (
        <html lang={params.locale} suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextIntlClientProvider messages={messages} locale={params.locale}>
                        <Navbar />
                        {children}
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
} 