/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom'
import { jest } from '@jest/globals'

const mockUseTranslations = () => (key: string) => key
jest.mock('next-intl', () => ({
    useTranslations: mockUseTranslations
}))

jest.mock('next-themes', () => ({
    ThemeProvider: function ThemeProvider({ children }: { children: any }) {
        return children
    },
    useTheme: () => ({ theme: 'light', setTheme: jest.fn() })
}))

Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn()
    }
})

Object.defineProperty(window, 'location', {
    value: {
        pathname: '/de'
    },
    writable: true
})
