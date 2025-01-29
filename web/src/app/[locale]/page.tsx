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
import { Trash } from "lucide-react"
import { Enum, InferValue } from "better-enums"

export const characterSets = {
  en: {
    capitalConsonants: 'BCDFGHJKLMNPQRSTVWXYZ',
    capitalSpecial: '',
    capitalVowels: 'AEIOU',
    smallConsonants: 'bcdfghjklmnpqrstvwxyz',
    smallSpecial: '',
    smallVowels: 'aeiou',
    maxConsonantsInRow: 3,
    maxVowelsInRow: 2,
    maxSpecialInRow: 1,
    specialRatio: 0,
    vowelRatio: 0.3
  },
  es: {
    capitalConsonants: 'BCDFGHJKLMNPQRSTVWXYZ',
    capitalSpecial: 'ÁÉÍÓÚÑ',
    capitalVowels: 'AEIOU',
    smallConsonants: 'bcdfghjklmnpqrstvwxyz',
    smallSpecial: 'áéíóúñü',
    smallVowels: 'aeiou',
    maxConsonantsInRow: 3,
    maxVowelsInRow: 2,
    maxSpecialInRow: 1,
    specialRatio: 0.1,
    vowelRatio: 0.2,
  },
  fr: {
    capitalConsonants: 'BCDFGHJKLMNPQRSTVWXYZ',
    capitalVowels: 'AEIOU',
    capitalSpecial: 'ÀÂÇÉÈÊËÎÏÔÙÛÜ',
    smallConsonants: 'bcdfghjklmnpqrstvwxyz',
    smallVowels: 'aeiou',
    smallSpecial: 'àâçéèêëîïôùûü',
    maxConsonantsInRow: 3,
    maxVowelsInRow: 2,
    maxSpecialInRow: 1,
    specialRatio: 0.1,
    vowelRatio: 0.2
  },
  de: {
    capitalConsonants: 'BCDFGHJKLMNPQRSTVWXYZ',
    capitalVowels: 'AEIOU',
    capitalSpecial: 'ÄÖÜ',
    smallConsonants: 'bcdfghjklmnpqrstvwxyzß',
    smallVowels: 'aeiou',
    smallSpecial: 'äöüß',
    maxConsonantsInRow: 3,
    maxVowelsInRow: 2,
    maxSpecialInRow: 1,
    specialRatio: 0.05,
    vowelRatio: 0.3
  }
}
export default function Home() {

  const USECAPTAILS = Enum(["SMALL", "CAPITAL", "SMALL_AND_CAPITAL", "ALL"])
  type UseCapitals = InferValue<typeof USECAPTAILS>

  const SPEED = Enum(["VERY_SLOW", "SLOW", "MEDIUM", "FAST", "EXTREME"])
  type Speed = InferValue<typeof SPEED>

  const [displayText, setDisplayText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [isTextVisible, setIsTextVisible] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [characterCount, setCharacterCount] = useState(5)
  const [speed, setSpeed] = useState<Speed>("MEDIUM")
  const [useCapitals, setUseCapitals] = useState<UseCapitals>("SMALL")
  const [highScore, setHighScore] = useState(0)
  const [accordionValue, setAccordionValue] = useState<string>("")
  const [userInputRequired, setUserInputRequired] = useState(false)
  const [allowSpecial, setAllowSpecial] = useState(true)
  const [textSettings, setTextSettings] = useState(characterSets.de)
  const t = useTranslations()
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)


  // Add locale-specific character sets


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

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('characterCount', characterCount.toString())
    localStorage.setItem('useCapitals', useCapitals.toString())
    localStorage.setItem('speed', speed.toString())
    localStorage.setItem('allowSpecial', allowSpecial.toString())
  }, [characterCount, useCapitals, speed, allowSpecial])

  // Update high score when score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('highScore', score.toString())
    }
  }, [score, highScore])

  // Modify generateRandomString to use difficulty and capitals settings
  const generateRandomString = () => {

    const maxConsonantsInRow = textSettings.maxConsonantsInRow
    const maxVowelsInRow = textSettings.maxVowelsInRow


    let consonantsInRow = 0
    let vowelsInRow = 0
    let specialInRow = 0
    let result = ""

    for (let i = 0; i < characterCount; i++) {
      let vowelsToUse = ""
      const shouldUseSpecial = Math.random() < textSettings.specialRatio && specialInRow < textSettings.maxSpecialInRow
      console.log(shouldUseSpecial)
      if (useCapitals == "SMALL_AND_CAPITAL") {
        vowelsToUse = (shouldUseSpecial ? (textSettings.smallSpecial + textSettings.capitalSpecial) : textSettings.capitalVowels + textSettings.smallVowels)
      } else if (useCapitals == "SMALL") {
        vowelsToUse = (shouldUseSpecial ? textSettings.smallSpecial : textSettings.smallVowels)
      } else if (useCapitals == "CAPITAL" && i == 0) {
        vowelsToUse = (shouldUseSpecial ? textSettings.capitalSpecial : textSettings.capitalVowels)
      } else if (useCapitals == "ALL") {
        vowelsToUse = (shouldUseSpecial ? textSettings.capitalSpecial : textSettings.capitalVowels)
      } else {
        vowelsToUse = (shouldUseSpecial ? textSettings.smallSpecial : textSettings.smallVowels)
      }
      console.log(vowelsToUse)
      let consonantsToUse = ""
      if (useCapitals == "SMALL_AND_CAPITAL") {
        consonantsToUse = (shouldUseSpecial ? textSettings.smallSpecial + textSettings.capitalSpecial : textSettings.capitalConsonants + textSettings.smallConsonants)
      } else if (useCapitals == "SMALL") {
        consonantsToUse = (shouldUseSpecial ? textSettings.smallSpecial : textSettings.smallConsonants)
      } else if (useCapitals == "CAPITAL" && i == 0) {
        consonantsToUse = (shouldUseSpecial ? textSettings.capitalSpecial : textSettings.capitalConsonants)
      } else if (useCapitals == "ALL") {
        consonantsToUse = (shouldUseSpecial ? textSettings.capitalSpecial : textSettings.capitalConsonants)
      } else {
        consonantsToUse = (shouldUseSpecial ? textSettings.smallSpecial : textSettings.smallConsonants)
      }
      console.log(consonantsToUse)

      if (consonantsInRow >= maxConsonantsInRow || (!result.toLocaleLowerCase().includes(textSettings.smallVowels) && i == characterCount - 1)) {
        result += vowelsToUse.charAt(Math.floor(Math.random() * vowelsToUse.length))
        vowelsInRow++
      } else if (vowelsInRow >= maxVowelsInRow || (!result.toLocaleLowerCase().includes(textSettings.smallConsonants) && i == characterCount - 1)) {
        result += consonantsToUse.charAt(Math.floor(Math.random() * consonantsToUse.length))
        consonantsInRow++
      } else {
        if (Math.random() < textSettings.vowelRatio) {
          result += vowelsToUse.charAt(Math.floor(Math.random() * vowelsToUse.length))
          vowelsInRow += 1
        } else {
          result += consonantsToUse.charAt(Math.floor(Math.random() * consonantsToUse.length))
          consonantsInRow += 1
        }
      }
    }

    return result;
  }


  const startNewRound = () => {
    setUserInput("")
    setDisplayText(generateRandomString())
    setIsTextVisible(true)
    setGameStarted(true)
    setUserInputRequired(false)

    // Hide the text after the time calculated
    const hideDelay = 1000 + characterCount * 175 + Math.min(1750, characterCount * characterCount * 20)
    const speedMultiplier = speed == "VERY_SLOW" ? 2 : speed == "SLOW" ? 1.2 : speed == "MEDIUM" ? 0.75 : speed == "FAST" ? 0.55 : speed == "EXTREME" ? 0.15 : 1

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
    timeoutRef.current = setTimeout(() => {
      setIsTextVisible(false)
    }, Math.round(hideDelay * speedMultiplier))
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
              <Button disabled={highScore == 0} className="px-2 mx-0.5" variant="ghost" onClick={() => {
                setHighScore(0)
                localStorage.setItem('highScore', '0')
              }}><Trash className="w-1 h-1" /></Button>
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
                <div className="space-y-2 mt-3">
                  <div className="flex items-start justify-between pb-2">
                    <Label>{t('difficulty')}</Label>
                    <div className="flex flex-col items-center w-[60%] pl-[10px]">
                      <Slider
                        min={3}
                        max={10}
                        step={1}
                        value={[characterCount]}
                        onValueChange={(value: number[]) => setCharacterCount(value[0])}
                        className="w-full"
                      />
                      <div className=" text-muted-foreground w-full mt-2">
                        <p className="text-center whitespace-nowrap text-xs">
                          {characterCount} {t('characters')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start justify-between pb-2">
                    <Label>{t('speed')}</Label>
                    <div className="flex flex-col items-center w-[60%] pl-[10px]">
                      <Slider
                        min={0}
                        max={4}
                        step={1}
                        value={[SPEED.values().findIndex(value => value === speed)]}
                        onValueChange={(value: number[]) => setSpeed(SPEED.values()[value[0]] ?? "MEDIUM")}
                        className="w-full"
                      />
                      <div className="text-muted-foreground w-full mt-2">
                        <p className="text-center whitespace-nowrap text-xs">
                          {speed === "VERY_SLOW" && t('verySlow')}
                          {speed === "SLOW" && t('slow')}
                          {speed === "MEDIUM" && t('medium')}
                          {speed === "FAST" && t('fast')}
                          {speed === "EXTREME" && t('extreme')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="my-4" />
                {textSettings.specialRatio > 0 && <div className="space-y-2 mt-5">
                  <div className="flex items-start justify-between pb-4">
                    <Label>{t('allowSpecial')}</Label>
                    <div className="flex flex-col items-center pl-[10px]">
                      <Switch
                        checked={allowSpecial}
                        onCheckedChange={setAllowSpecial}
                        className=""
                      />
                    </div>
                  </div>
                </div>}
                <div className="space-y-2">
                  <div className="flex items-start justify-between pb-2">
                    <Label>{t('useCapitals')}</Label>
                    <div className="flex flex-col items-center w-[60%]">
                      <Slider
                        min={0}
                        max={3}
                        step={1}
                        value={[USECAPTAILS.values().findIndex(value => value === useCapitals)]}
                        onValueChange={(value: number[]) => setUseCapitals(USECAPTAILS.values()[value[0]] ?? "SMALL")}
                        className="w-full"
                      />
                      <div className="text-muted-foreground w-full mt-2">
                        <p className="text-center whitespace-nowrap text-xs">
                          {useCapitals === "SMALL" && t('onlySmall')}
                          {useCapitals === "CAPITAL" && t('onlyCapital')}
                          {useCapitals === "SMALL_AND_CAPITAL" && t('mixedCase')}
                          {useCapitals === "ALL" && t('allCapital')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <p className="text-sm text-center text-muted-foreground">
            {t('instructions')}
          </p>

        </CardContent>
      </Card>
    </div >
  )
}
