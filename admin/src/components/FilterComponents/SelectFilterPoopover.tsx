import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { SortDirection, SortField, SortOption } from "../Brand/BrandFilters";

type SortFilterPopoverProps = {
  value: { label: string; field: SortField; direction: SortDirection };
  onChange: (val: { label: string; field: SortField; direction: SortDirection }) => void;
  options: SortOption[];
  parentClass?: string;
  triggerClass?: string;
  contentClass?: string;
};



export const SortFilterPopover = ({
  value,
  onChange,
  options,
  parentClass = "w-[140px]",
  triggerClass = "w-full",
  contentClass = "w-full min-w-[140px]",
}: SortFilterPopoverProps) => {

  return (
    <div className={`flex flex-col items-start space-y-1 ${parentClass}`}>
      <Popover>
        <PopoverTrigger asChild className={triggerClass}>
          <Button
            variant="outline"
            className="text-sm flex items-center justify-between"
          >
            <span>{value.label || "Sort"}</span>
            <ArrowUpDown size={14} />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="end"
          className={`p-2 text-sm space-y-1 ${contentClass}`}
        >
          {options.map((opt) => {
            const isResetOption = opt.value === "";
            const isSelected = value.field === opt.value;

            const nextDirection: SortDirection = isResetOption
              ? ""
              : isSelected
                ? value.direction === "asc" ? "desc" : "asc"
                : "asc";
            return (
              <div
                key={opt.value || "reset"}
                className={`flex items-center justify-between gap-4 hover:bg-accent px-2 py-2 rounded-md cursor-pointer ${isSelected && "bg-accent"}`}
                onClick={() =>
                  onChange({
                    label: opt.label,
                    field: opt.value as SortField,
                    direction: nextDirection,
                  })
                }
              >
                <span>{opt.label}</span>

                {/* Show direction only if selected and not a reset option */}
                {!isResetOption && isSelected && value.direction && (
                  <span className="text-xs text-muted-foreground capitalize">
                    {value.direction}
                  </span>
                )}
              </div>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
};


