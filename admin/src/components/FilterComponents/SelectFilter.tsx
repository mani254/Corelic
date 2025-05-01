import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type SelectOption = { label: string; value: string | number | null }

type SelectFilterProps = {
  value: string | number
  onChange: (val: never) => void
  options: SelectOption[]
  placeholder: string
  iconComponent?: React.ReactNode
  triggerClass?: string,
  contentClass?: string,
}

export const SelectFilter = ({
  value,
  onChange,
  options,
  placeholder,
  iconComponent,
  triggerClass = 'w-[100px]',
  contentClass = 'w-[100px] absolute -right-[100px]'
}: SelectFilterProps) => (
  <div className={`flex flex-col items-start space-y-1`}>
    <Select value={value as string} onValueChange={onChange}>
      <SelectTrigger className={`text-sm  ${triggerClass}`} iconComponent={iconComponent}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={contentClass}>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value as string}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)
