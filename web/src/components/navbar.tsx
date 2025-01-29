"use client"

import { useParams } from "next/navigation"
import { useRouter, usePathname } from '@/i18n/navigation'
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Logo } from "./logo"
import Link from "next/link"

import { GB, DE, ES, FR } from 'country-flag-icons/react/3x2'

type Language = 'en' | 'de' | 'es' | 'fr'

const LANGUAGE_NAMES: Record<Language, string> = {
    en: "English",
    de: "Deutsch",
    es: "Español",
    fr: "Français"
}

export function Navbar() {
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()
    const { theme, setTheme } = useTheme()
    const currentLocale = params.locale as Language

    const handleLanguageChange = (newLocale: Language) => {
        router.replace(pathname, { locale: newLocale })
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className=" px-5 w-full flex h-14 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 ml-5">

                    <Logo className="w-8 h-8" />
                    <span className="font-bold">MemType</span>

                </Link>

                <div className="flex items-center justify-end gap-4">
                    <Select
                        defaultValue={currentLocale}
                        onValueChange={handleLanguageChange}
                    >
                        <SelectTrigger className="w-[130px]">
                            <SelectValue className="">
                                <div className="flex flex-row items-center justify-center gap-2">
                                    <div className="w-4 h-4 mt-1">
                                        {currentLocale === 'en' ? <GB /> : currentLocale === 'de' ? <DE /> : currentLocale === 'es' ? <ES /> : <FR />}
                                    </div>
                                    <p className="text-sm">{LANGUAGE_NAMES[currentLocale]}</p>
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
                                <SelectItem key={code} value={code}>
                                    <div className="flex flex-row items-center justify-center gap-2">
                                        <div className="w-4 h-4">
                                            {code === 'en' ? <GB /> : code === 'de' ? <DE /> : code === 'es' ? <ES /> : <FR />}
                                        </div>
                                        <p className="text-sm">{name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                </div>
            </div>
        </header>
    )
} 