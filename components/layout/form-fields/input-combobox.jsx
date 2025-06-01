"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const InputCombobox = ({
  defaultValue,
  disabled,
  className,
  popoverClassName,
  placeholder,
  searchPlaceholder,
  onChange,
  groups,
  separator,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || "");

  const handleChange = (currentValue) => {
    if (currentValue === value) return;
    setValue(currentValue);
    onChange(currentValue);
    setOpen(false);
  };

  const options = groups?.map((group) => group.options).flat();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* // ==== TRIGGER ==== */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? options?.find((option) => option.value === value)?.buttonLabel
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* // ==== CONTENT ==== */}
      <PopoverContent className={cn("w-[200px] p-0", popoverClassName)}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {/* // ==== GROUP ==== */}
            {groups?.map((group, index) => (
              <OptionGroup
                key={index}
                group={group}
                value={value}
                handleChange={handleChange}
                separator={separator}
              />
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// ===== OPTION GROUP =====
const OptionGroup = ({ group, handleChange, separator = false }) => {
  return (
    <>
      <CommandGroup heading={group?.name}>
        {group?.options?.map((option) => (
          <CommandItem
            key={option?.value}
            onSelect={() => handleChange(option?.value)}
          >
            {option?.label}
          </CommandItem>
        ))}
      </CommandGroup>
      {separator && <CommandSeparator />}
    </>
  );
};

export default InputCombobox;
