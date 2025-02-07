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
import {
    USECAPTAILS,
    SPEED,
    type UseCapitals,
    type Speed,
    type CharacterSet
} from '@/lib/game-logic'

interface GameSettingsProps {
    characterCount: number
    setCharacterCount: (value: number) => void
    speed: Speed
    setSpeed: (value: Speed) => void
    useCapitals: UseCapitals
    setUseCapitals: (value: UseCapitals) => void
    allowSpecial: boolean
    setAllowSpecial: (value: boolean) => void
    textSettings: CharacterSet
}

export function GameSettings({
    characterCount,
    setCharacterCount,
    speed,
    setSpeed,
    useCapitals,
    setUseCapitals,
    allowSpecial,
    setAllowSpecial,
    textSettings
}: GameSettingsProps) {
    const t = useTranslations()

    return (
        <Accordion type="single" collapsible>
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
                                <div className="text-muted-foreground w-full mt-2">
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

                    {textSettings.specialRatio > 0 && (
                        <div className="space-y-2 mt-5">
                            <div className="flex items-start justify-between pb-4">
                                <Label>{t('allowSpecial')}</Label>
                                <div className="flex flex-col items-center pl-[10px]">
                                    <Switch
                                        checked={allowSpecial}
                                        onCheckedChange={setAllowSpecial}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

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
    )
} 