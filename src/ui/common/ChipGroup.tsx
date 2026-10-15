interface ChipOption<T> { value: T; label: string }

interface ChipGroupProps<T extends string | number> {
  label: string
  value: T
  options: ChipOption<T>[]
  onChange(value: T): void
}

export function ChipGroup<T extends string | number>({ label, value, options, onChange }: ChipGroupProps<T>) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" className="chip" aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  )
}
