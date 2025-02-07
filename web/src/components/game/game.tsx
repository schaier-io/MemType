"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'
import { GameSettings } from "@/components/game/game-settings"
import { Trash } from "lucide-react"
import {
    USECAPTAILS,
    SPEED,
    characterSets,
    getCurrentLocale,
    generateRandomString,
    calculateHideDelay,
    type UseCapitals,
    type Speed,
    type CharacterSet
} from '@/lib/game-logic'

export function Game() {
    const [displayText, setDisplayText] = useState("")
    const [userInput, setUserInput] = useState("")
    const [isTextVisible, setIsTextVisible] = useState(false)
    const [score, setScore] = useState(0)
    const [gameStarted, setGameStarted] = useState(false)
    const [characterCount, setCharacterCount] = useState(5)
    const [speed, setSpeed] = useState<Speed>("MEDIUM")
    const [useCapitals, setUseCapitals] = useState<UseCapitals>("SMALL")
    const [highScore, setHighScore] = useState(0)
    const [userInputRequired, setUserInputRequired] = useState(false)
    const [allowSpecial, setAllowSpecial] = useState(true)
    const [textSettings, setTextSettings] = useState<CharacterSet>(characterSets.de)

    const t = useTranslations()
    const inputRef = useRef<HTMLInputElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const locale = getCurrentLocale()
            setTextSettings(characterSets[locale as keyof typeof characterSets] || characterSets.de)
            const savedCharacterCount = localStorage.getItem('characterCount')
            const savedUseCapitals = localStorage.getItem('useCapitals')
            const savedSpeed = localStorage.getItem('speed')
            const savedHighScore = localStorage.getItem('highScore')
            const allowSpecial = localStorage.getItem('allowSpecial')

            if (savedCharacterCount) setCharacterCount(parseInt(savedCharacterCount))
            if (savedUseCapitals) setUseCapitals(USECAPTAILS.values().find(value => value === savedUseCapitals) ?? "SMALL")
            if (savedSpeed) setSpeed(SPEED.values().find(value => value === savedSpeed) ?? "MEDIUM")
            if (savedHighScore) setHighScore(parseInt(savedHighScore))
            if (allowSpecial) setAllowSpecial(allowSpecial === "true")
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('characterCount', characterCount.toString())
        localStorage.setItem('useCapitals', useCapitals.toString())
        localStorage.setItem('speed', speed.toString())
        localStorage.setItem('allowSpecial', allowSpecial.toString())
    }, [characterCount, useCapitals, speed, allowSpecial])

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score)
            localStorage.setItem('highScore', score.toString())
        }
    }, [score, highScore])

    const startNewRound = () => {
        setUserInput("")
        setDisplayText(generateRandomString(characterCount, useCapitals, textSettings))
        setIsTextVisible(true)
        setGameStarted(true)
        setUserInputRequired(false)

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setTimeout(() => {
            inputRef.current?.focus()
        }, 0)
        timeoutRef.current = setTimeout(() => {
            setIsTextVisible(false)
        }, calculateHideDelay(characterCount, speed))
    }

    useEffect(() => {
        if (isTextVisible == false) {
            inputRef.current?.focus()
        }
    }, [isTextVisible])

    const handleSubmit = () => {
        if (userInput.length == 0) {
            setUserInputRequired(true)
            return
        }
        setUserInputRequired(false)
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        if (userInput === displayText) {
            setScore(score + 1)
        } else {
            setScore(0)
        }
        startNewRound()
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">{t('title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex text-start items-center justify-between">
                        <p className="">{t('score')}: {score}</p>
                        <div className="flex justify-start items-center">
                            <p className="">{t('highScore')}: {highScore}</p>
                            <Button
                                disabled={highScore == 0}
                                className="px-2 mx-0.5"
                                variant="ghost"
                                onClick={() => {
                                    setHighScore(0)
                                    localStorage.setItem('highScore', '0')
                                }}
                            >
                                <Trash className="w-1 h-1" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-start items-center gap-2 mb-2">
                        {isTextVisible && (
                            <div className="text-2xl font-bold mb-4">{displayText}</div>
                        )}
                        {!isTextVisible && gameStarted && (
                            <div className="text-2xl font-bold mb-4">{"* ".repeat(displayText.length)}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-col gap-1">
                            {userInputRequired && userInput.length == 0 && (
                                <p className="text-red-500 text-sm ml-0.5">{t('userInputRequired')}</p>
                            )}
                            <Input
                                ref={inputRef}
                                type="text"
                                placeholder={t('placeholder')}
                                value={userInput}
                                disabled={!gameStarted}
                                onChange={(e) => {
                                    setIsTextVisible(false)
                                    setUserInput(e.target.value)
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSubmit()
                                    }
                                }}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                className="w-full"
                                onClick={handleSubmit}
                                disabled={!gameStarted}
                            >
                                {t('submit')}
                            </Button>

                            <Button
                                className="w-full"
                                onClick={startNewRound}
                                disabled={isTextVisible}
                                variant="outline"
                            >
                                {gameStarted ? t('newText') : t('startGame')}
                            </Button>
                        </div>
                    </div>

                    <GameSettings
                        characterCount={characterCount}
                        setCharacterCount={setCharacterCount}
                        speed={speed}
                        setSpeed={setSpeed}
                        useCapitals={useCapitals}
                        setUseCapitals={setUseCapitals}
                        allowSpecial={allowSpecial}
                        setAllowSpecial={setAllowSpecial}
                        textSettings={textSettings}
                    />

                    <p className="text-sm text-center text-muted-foreground">
                        {t('instructions')}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
} 