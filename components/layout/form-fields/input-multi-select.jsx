"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const InputMultiSelect = ({
  options,
  value = [],
  onChange,
  placeholder = "Select items...",
  className,
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  button,
  align = "start",
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (currentValue) => {
    const newValue = value.includes(currentValue)
      ? value.filter((item) => item !== currentValue)
      : [...value, currentValue];
    onChange?.(newValue);
  };

  const filteredOptions = options?.filter(
    (option) => !value?.some((id) => id === option.value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        {button || (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(className)}
          >
            {value.length === 0 ? placeholder : `${value.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-full p-0" align={align}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default InputMultiSelect;
