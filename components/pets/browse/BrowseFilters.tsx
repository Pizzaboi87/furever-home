'use client'

import Image from '@/components/ui/LoadingImage'
import { CalendarDays, PawPrint, RotateCcw, Ruler, SlidersHorizontal } from 'lucide-react'

import MotionReveal from '@/components/ui/MotionReveal'
import { formatLabel } from '@/lib/pet-format'
import {
  compatibilityOptions,
  getGenderIcon,
  toggleSelectedValue,
} from '@/utils/pets/browse-utils'

import RangeSlider from './RangeSlider'

type BrowseFiltersProps = {
  categories: string[]
  genders: string[]
  sizes: string[]
  maxPetAge: number
  activeFilterCount: number
  selectedCategory: string
  minAge: number
  maxAge: number
  selectedGender: string
  selectedSizes: string[]
  selectedCompatibility: string[]
  onCategoryChange: (value: string) => void
  onAgeChange: (value: [number, number]) => void
  onGenderChange: (value: string) => void
  onSizesChange: (value: string[]) => void
  onCompatibilityChange: (value: string[]) => void
  onReset: () => void
}

const BrowseFilters = ({
  categories,
  genders,
  sizes,
  maxPetAge,
  activeFilterCount,
  selectedCategory,
  minAge,
  maxAge,
  selectedGender,
  selectedSizes,
  selectedCompatibility,
  onCategoryChange,
  onAgeChange,
  onGenderChange,
  onSizesChange,
  onCompatibilityChange,
  onReset,
}: BrowseFiltersProps) => {
  return (
    <aside className="lg:col-span-1">
      <MotionReveal className="rounded-2xl border border-border bg-white shadow-sm lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
        <div className="space-y-6 p-5">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="text-sm font-bold text-foreground">Filters</h2>
            </div>

            {activeFilterCount > 0 && (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
                {activeFilterCount} active
              </span>
            )}
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-foreground">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={selectedCategory === category}
                  onClick={() => onCategoryChange(category)}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-3 text-left text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105 ${
                    selectedCategory === category
                      ? 'border-primary bg-linear-to-r from-[#5f57e7] to-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-white text-foreground hover:border-primary hover:bg-indigo-50'
                  }`}
                >
                  <span className="relative h-6 w-6 shrink-0">
                    <Image
                      src={`/images/assets/${category !== 'all' ? category : 'paw-outline'}.png`}
                      alt={formatLabel(category)}
                      fill
                      sizes="24px"
                      className={
                        selectedCategory === category
                          ? 'pointer-events-none object-contain invert'
                          : 'pointer-events-none object-contain'
                      }
                    />
                  </span>
                  <span>{formatLabel(category)}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-foreground">Gender</label>
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-input p-1">
              {genders.map((gender) => (
                <button
                  key={gender}
                  type="button"
                  aria-pressed={selectedGender === gender}
                  onClick={() => onGenderChange(gender)}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                    selectedGender === gender
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {getGenderIcon(gender)}
                  <span>{formatLabel(gender)}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Ruler className="h-4 w-4 text-primary" aria-hidden="true" />
              Size
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-input p-1">
              {sizes.map((size) => {
                const isSelected = selectedSizes.includes(size)

                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onSizesChange(toggleSelectedValue(selectedSizes, size))}
                    className={`flex cursor-pointer items-center justify-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{formatLabel(size)}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <PawPrint className="h-4 w-4 text-primary" aria-hidden="true" />
              Good with
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-input p-1">
              {compatibilityOptions.map((option) => {
                const isSelected = selectedCompatibility.includes(option.value)

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      onCompatibilityChange(
                        toggleSelectedValue(selectedCompatibility, option.value)
                      )
                    }
                    className={`flex cursor-pointer items-center justify-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-4">
            <label className="mb-4 flex items-center justify-between gap-3 text-sm font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                Age Range
              </span>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-primary">
                {minAge} - {maxAge}y
              </span>
            </label>

            <RangeSlider
              min={0}
              max={maxPetAge}
              value={[minAge, maxAge]}
              unit="y"
              minLabel="Minimum age"
              maxLabel="Maximum age"
              onChange={onAgeChange}
            />
          </div>

          <button
            type="button"
            onClick={onReset}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-3 font-semibold text-foreground transition-colors hover:border-primary hover:bg-indigo-50"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset Filters
          </button>
        </div>
      </MotionReveal>
    </aside>
  )
}

export default BrowseFilters
