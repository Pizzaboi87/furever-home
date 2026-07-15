'use client'

import { Slider } from '@base-ui/react/slider'

type RangeSliderProps = {
  min: number
  max: number
  value: [number, number]
  unit: string
  minLabel: string
  maxLabel: string
  onChange: (value: [number, number]) => void
}

const RangeSlider = ({
  min,
  max,
  value,
  unit,
  minLabel,
  maxLabel,
  onChange,
}: RangeSliderProps) => {
  const handleValueChange = (nextValue: readonly number[]) => {
    if (nextValue.length < 2) {
      return
    }

    onChange([nextValue[0], nextValue[1]])
  }

  return (
    <div className="space-y-3">
      <Slider.Root
        min={min}
        max={max}
        step={1}
        value={value}
        onValueChange={handleValueChange}
        thumbAlignment="edge"
        thumbCollisionBehavior="none"
      >
        <Slider.Control className="flex w-full touch-none items-center py-3 select-none">
          <Slider.Track className="relative h-2 w-full rounded-full bg-input select-none">
            <Slider.Indicator className="rounded-full bg-primary select-none" />
            <Slider.Thumb
              index={0}
              aria-label={minLabel}
              getAriaValueText={(_, currentValue) => `${currentValue}${unit}`}
              className="size-5 rounded-full border-2 border-primary bg-white shadow-sm select-none transition-transform hover:scale-110 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary"
            />
            <Slider.Thumb
              index={1}
              aria-label={maxLabel}
              getAriaValueText={(_, currentValue) => `${currentValue}${unit}`}
              className="size-5 rounded-full border-2 border-primary bg-white shadow-sm select-none transition-transform hover:scale-110 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary"
            />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>

      <div className="flex justify-between text-xs font-medium text-muted-foreground">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  )
}

export default RangeSlider
