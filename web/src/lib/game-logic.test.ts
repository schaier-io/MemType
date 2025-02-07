import { USECAPTAILS, SPEED, generateRandomString, calculateHideDelay, characterSets } from './game-logic'
import { describe, it, expect } from '@jest/globals'
describe('generateRandomString', () => {
    it('generates string of correct length', () => {
        const result = generateRandomString(10, "SMALL", characterSets.en)
        expect(result.length).toBe(10)
    })

    it('respects SMALL capitals setting', () => {
        const result = generateRandomString(20, "SMALL", characterSets.en)
        expect(result).toMatch(/^[a-z]+$/)
    })

    it('respects ALL capitals setting', () => {
        const result = generateRandomString(20, "ALL", characterSets.en)
        expect(result).toMatch(/^[A-Z]+$/)
    })

    it('respects maxConsonantsInRow constraint', () => {
        const result = generateRandomString(30, "SMALL", characterSets.en)
        // Check that we never have more than maxConsonantsInRow consonants in a row
        const consonantGroups = result.match(/[bcdfghjklmnpqrstvwxyz]+/g) || []
        consonantGroups.forEach(group => {
            expect(group.length).toBeLessThanOrEqual(characterSets.en.maxConsonantsInRow)
        })
    })

    it('respects maxVowelsInRow constraint', () => {
        const result = generateRandomString(30, "SMALL", characterSets.en)
        // Check that we never have more than maxVowelsInRow vowels in a row
        const vowelGroups = result.match(/[aeiou]+/g) || []
        vowelGroups.forEach(group => {

            expect(group.length).toBeLessThanOrEqual(characterSets.en.maxVowelsInRow)
        })
    })

    it('includes special characters for non-English languages', () => {
        const result = generateRandomString(100, "SMALL", characterSets.de)
        // Test with a large string to increase chances of special characters
        expect(result).toMatch(/[äöüß]/)
    })
})

describe('calculateHideDelay', () => {
    it('returns larger delay for longer strings', () => {
        const shortDelay = calculateHideDelay(5, "MEDIUM")
        const longDelay = calculateHideDelay(10, "MEDIUM")
        expect(longDelay).toBeGreaterThan(shortDelay)
    })

    it('returns shorter delay for faster speeds', () => {
        const length = 10
        const slowDelay = calculateHideDelay(length, "SLOW")
        const fastDelay = calculateHideDelay(length, "FAST")
        expect(fastDelay).toBeLessThan(slowDelay)
    })

    it('returns expected delays for different speeds', () => {
        const length = 5
        const speeds = ["VERY_SLOW", "SLOW", "MEDIUM", "FAST", "EXTREME"] as const
        const delays = speeds.map(speed => calculateHideDelay(length, speed))

        // Verify delays are in descending order
        for (let i = 1; i < delays.length; i++) {
            expect(delays[i]).toBeLessThan(delays[i - 1])
        }
    })

    it('returns integer values', () => {
        const delay = calculateHideDelay(7, "MEDIUM")
        expect(Number.isInteger(delay)).toBe(true)
    })
}) 