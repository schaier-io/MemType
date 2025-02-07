import { Enum, InferValue } from "better-enums"

export const USECAPTAILS = Enum(["SMALL", "CAPITAL", "SMALL_AND_CAPITAL", "ALL"])
export type UseCapitals = InferValue<typeof USECAPTAILS>

export const SPEED = Enum(["VERY_SLOW", "SLOW", "MEDIUM", "FAST", "EXTREME"])
export type Speed = InferValue<typeof SPEED>

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

export type CharacterSet = typeof characterSets.de

export const getCurrentLocale = () => {
    if (typeof window !== 'undefined') {
        const pathParts = window.location.pathname.split('/')
        return pathParts[1] || 'de' // Default to 'de' if no locale found
    }
    return 'de'
}

export const generateRandomString = (
    characterCount: number,
    useCapitals: UseCapitals,
    textSettings: CharacterSet
) => {
    const maxConsonantsInRow = textSettings.maxConsonantsInRow
    const maxVowelsInRow = textSettings.maxVowelsInRow

    let consonantsInRow = 0
    let vowelsInRow = 0
    let specialInRow = 0
    let result = ""

    for (let i = 0; i < characterCount; i++) {
        let vowelsToUse = ""
        const shouldUseSpecial = Math.random() < textSettings.specialRatio && specialInRow < textSettings.maxSpecialInRow

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

        if (consonantsInRow >= maxConsonantsInRow || (!result.toLocaleLowerCase().includes(textSettings.smallVowels) && i == characterCount - 1)) {
            result += vowelsToUse.charAt(Math.floor(Math.random() * vowelsToUse.length))
            vowelsInRow++
            consonantsInRow = 0
        } else if (vowelsInRow >= maxVowelsInRow || (!result.toLocaleLowerCase().includes(textSettings.smallConsonants) && i == characterCount - 1)) {
            result += consonantsToUse.charAt(Math.floor(Math.random() * consonantsToUse.length))
            consonantsInRow++
            vowelsInRow = 0
        } else {
            if (Math.random() < textSettings.vowelRatio) {
                result += vowelsToUse.charAt(Math.floor(Math.random() * vowelsToUse.length))
                vowelsInRow += 1
                consonantsInRow = 0
            } else {
                result += consonantsToUse.charAt(Math.floor(Math.random() * consonantsToUse.length))
                consonantsInRow += 1
                vowelsInRow = 0
            }
        }
    }

    return result
}

export const calculateHideDelay = (characterCount: number, speed: Speed) => {
    const baseDelay = 1000 + characterCount * 175 + Math.min(1750, characterCount * characterCount * 20)
    const speedMultiplier = speed == "VERY_SLOW" ? 2 :
        speed == "SLOW" ? 1.2 :
            speed == "MEDIUM" ? 0.75 :
                speed == "FAST" ? 0.55 :
                    speed == "EXTREME" ? 0.15 : 1

    return Math.round(baseDelay * speedMultiplier)
} 