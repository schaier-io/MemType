"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Home() {
  const [displayText, setDisplayText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [isTextVisible, setIsTextVisible] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [difficulty, setDifficulty] = useState(5)
  const [useCapitals, setUseCapitals] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [accordionValue, setAccordionValue] = useState<string>("")
  const [userInputRequired, setUserInputRequired] = useState(false)
  const t = useTranslations()
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)


  // Add locale-specific character sets
  const characterSets = {
    en: {
      capital: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      small: 'abcdefghijklmnopqrstuvwxyz'
    },
    es: {
      capital: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑ',
      small: 'abcdefghijklmnopqrstuvwxyzáéíóúñ'
    },
    fr: {
      capital: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÂÇÉÈÊËÎÏÔÙÛÜ',
      small: 'abcdefghijklmnopqrstuvwxyzàâçéèêëîïôùûü'
    },
    de: {
      capital: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜß',
      small: 'abcdefghijklmnopqrstuvwxyzäöü'
    }
  }

  // Get current locale from URL
  const getCurrentLocale = () => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/')
      return pathParts[1] || 'de' // Default to 'en' if no locale found
    }
    return 'de'
  }

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDifficulty = localStorage.getItem('difficulty')
      const savedUseCapitals = localStorage.getItem('useCapitals')
      const savedHighScore = localStorage.getItem('highScore')
      const savedAccordionValue = localStorage.getItem('accordionValue')

      if (savedDifficulty) setDifficulty(parseInt(savedDifficulty))
      if (savedUseCapitals) setUseCapitals(savedUseCapitals === 'true')
      if (savedHighScore) setHighScore(parseInt(savedHighScore))
      if (savedAccordionValue) setAccordionValue(savedAccordionValue)
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('difficulty', difficulty.toString())
    localStorage.setItem('useCapitals', useCapitals.toString())
    localStorage.setItem('accordionValue', accordionValue)
  }, [difficulty, useCapitals, accordionValue])

  // Update high score when score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('highScore', score.toString())
    }
  }, [score, highScore])

  // Modify generateRandomString to use difficulty and capitals settings
  const generateRandomString = () => {
    const locale = getCurrentLocale()
    const chars = characterSets[locale as keyof typeof characterSets] || characterSets.en
    const characters = useCapitals ? (chars.capital + chars.small) : chars.small

    return Array.from(Array(difficulty)).map(() =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('')
  }


  const startNewRound = () => {
    setUserInput("")
    setDisplayText(generateRandomString())
    setIsTextVisible(true)
    setGameStarted(true)
    setUserInputRequired(false)

    // Hide the text after the time calculated
    const hideDelay = Math.max(800, 200 + difficulty * 1000 + difficulty * difficulty * 30 - difficulty * difficulty * difficulty * 15)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
    timeoutRef.current = setTimeout(() => {
      setIsTextVisible(false)
    }, hideDelay)
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
          <div className="text-center">
            <p className="mb-2">{t('score')}: {score}</p>
            <p className="mb-2">{t('highScore')}: {highScore}</p>
            {isTextVisible && (
              <div className="text-2xl font-bold mb-4">{displayText}</div>
            )}
            {!isTextVisible && gameStarted && (
              <div className="text-2xl font-bold mb-4">{"* ".repeat(displayText.length)}</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              {userInputRequired && userInput.length == 0 && <p className="text-red-500 text-sm ml-0.5">{t('userInputRequired')}</p>}
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
                ref={buttonRef}
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
          <Accordion
            type="single"
            collapsible
            value={accordionValue}
            onValueChange={setAccordionValue}
          >
            <AccordionItem value="settings">
              <AccordionTrigger>{t('settings')}</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{t('difficulty')}: {difficulty}</Label>
                    <Slider
                      min={3}
                      max={10}
                      step={1}
                      value={[difficulty]}
                      onValueChange={(value) => setDifficulty(value[0])}
                      className="w-[60%]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t('useCapitals')}</Label>
                  <Switch
                    checked={useCapitals}
                    onCheckedChange={setUseCapitals}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <p className="text-sm text-center text-muted-foreground">
            {t('instructions')}
          </p>

        </CardContent>
      </Card>
    </div>
  )
}
