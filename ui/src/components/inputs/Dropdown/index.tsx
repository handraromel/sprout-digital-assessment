import { SIZE_CLASSES } from "@/constants/dropdown";
import { type DropdownProps } from "@/types/dropdown";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Portal,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { useCallback, useMemo } from "react";
import type { Control, FieldError, FieldValues, Path } from "react-hook-form";
import { useController } from "react-hook-form";

interface ResolvedControllerProps {
  fieldValue?: unknown;
  fieldOnChange?: (value: string) => void;
  fieldOnBlur?: () => void;
  fieldRef?: React.Ref<HTMLSelectElement>;
  fieldName?: string;
  fieldError?: FieldError;
}

function ControlledDropdownBridge<TFieldValues extends FieldValues>({
  control,
  name,
  children,
}: {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  children: (props: ResolvedControllerProps) => React.ReactNode;
}) {
  const { field, fieldState } = useController({ control, name });
  return children({
    fieldValue: field.value,
    fieldOnChange: field.onChange,
    fieldOnBlur: field.onBlur,
    fieldRef: field.ref,
    fieldName: field.name,
    fieldError: fieldState.error,
  });
}

function DropdownInner<TFieldValues extends FieldValues = FieldValues>({
  label,
  options,
  error: errorProp,
  helperText,
  register,
  className = "",
  small,
  large,
  placeholder,
  value: valueProp,
  onChange: onChangeProp,
  hierarchical = false,
  hideErrorMessage = false,
  controllerProps,
  ...props
}: Omit<DropdownProps<TFieldValues>, "control" | "name"> & {
  controllerProps?: ResolvedControllerProps;
}) {
  const size = small ? "small" : large ? "large" : "default";
  const sizeConfig = SIZE_CLASSES[size];

  const field = controllerProps;
  const error = errorProp ?? field?.fieldError;
  const value = valueProp ?? (field?.fieldValue as string) ?? "";

  const registerOnChange = register?.onChange;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (registerOnChange) {
        registerOnChange(e);
      }
      if (field?.fieldOnChange) {
        field.fieldOnChange(e.target.value);
      }
      if (onChangeProp) {
        if (typeof onChangeProp === "function") {
          const funcStr = onChangeProp.toString();
          if (funcStr.includes("value:") || funcStr.includes("(value)")) {
            (onChangeProp as (value: string) => void)(e.target.value);
          } else {
            (onChangeProp as React.ChangeEventHandler<HTMLSelectElement>)(e);
          }
        }
      }
    },
    [registerOnChange, field, onChangeProp],
  );

  const handleListboxChange = useCallback(
    (newValue: string) => {
      if (register) {
        const syntheticEvent = {
          target: { name: register.name, value: newValue },
        } as React.ChangeEvent<HTMLSelectElement>;
        registerOnChange?.(syntheticEvent);
      }
      if (field?.fieldOnChange) {
        field.fieldOnChange(newValue);
      }
      if (onChangeProp) {
        (onChangeProp as (value: string) => void)(newValue);
      }
    },
    [register, registerOnChange, field, onChangeProp],
  );

  const selectedOption = useMemo(
    () => options.find((opt) => String(opt.value) === String(value)),
    [options, value],
  );

  if (hierarchical) {
    return (
      <div className="w-full">
        {label && (
          <label
            className={`text-foreground mb-2 block font-medium ${sizeConfig.label}`}
          >
            {label}
          </label>
        )}
        <Listbox
          value={String(value || "")}
          onChange={handleListboxChange}
          disabled={props.disabled}
        >
          <div className="relative">
            <ListboxButton
              className={`bg-input-background text-input-text relative w-full cursor-pointer rounded-lg border-2 text-left transition-all ${sizeConfig.select} ${
                error
                  ? "border-error focus:border-error focus:ring-error/30 focus:ring-2"
                  : "border-input-border focus:border-input-border-focus focus:ring-input-border-focus/30 focus:ring-2"
              } ${
                props.disabled ? "cursor-not-allowed opacity-60" : ""
              } focus:outline-none ${className}`}
            >
              <span
                className={`block truncate ${!selectedOption ? "text-foreground-muted" : ""}`}
              >
                {selectedOption
                  ? selectedOption.label
                  : placeholder || "Pilih akun induk"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="text-foreground-muted h-5 w-5" />
              </span>
            </ListboxButton>
            <Portal>
              <ListboxOptions
                anchor="bottom start"
                className="bg-background-elevated border-border z-100 mt-1 h-100 max-h-100 w-(--button-width) overflow-auto rounded-lg border py-1 shadow-lg focus:outline-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent"
              >
                {options.map((option) => (
                  <ListboxOption
                    key={String(option.value)}
                    value={String(option.value)}
                    disabled={option.disabled}
                    className={({ active, selected, disabled }) =>
                      `relative py-2 pr-9 select-none ${
                        disabled
                          ? "cursor-not-allowed text-gray-400"
                          : active
                            ? "bg-background-surface text-foreground cursor-pointer"
                            : "text-foreground cursor-pointer"
                      } ${selected && !disabled ? "font-medium" : ""}`
                    }
                    style={{
                      paddingLeft: `${(option.level || 0) * 16 + 12}px`,
                    }}
                  >
                    {({ selected, disabled }) => (
                      <>
                        <span
                          className={`block truncate ${disabled ? "text-gray-400" : ""}`}
                        >
                          {option.label}
                        </span>
                        {selected && !disabled && (
                          <span className="text-primary absolute inset-y-0 right-0 flex items-center pr-3">
                            <CheckIcon className="h-5 w-5" />
                          </span>
                        )}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Portal>
          </div>
        </Listbox>
        {!hideErrorMessage && error && (
          <p className="text-error mt-1 text-sm">{error.message}</p>
        )}
        {helperText && !error && (
          <p className="text-foreground-muted mt-1 text-sm">{helperText}</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {label && (
        <label
          className={`text-foreground mb-2 block font-medium ${sizeConfig.label}`}
        >
          {label}
        </label>
      )}
      <select
        className={`bg-input-background text-input-text w-full appearance-none rounded-lg border-2 transition-all ${
          sizeConfig.select
        } ${
          error
            ? "border-error focus:border-error focus:ring-error/30 focus:ring-2"
            : "border-input-border focus:border-input-border-focus focus:ring-input-border-focus/30 focus:ring-2"
        } ${
          props.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        } focus:outline-none ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236272a4' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.75rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.25em 1.25em",
          paddingRight: "2.5rem",
        }}
        {...(register
          ? { name: register.name, ref: register.ref, onBlur: register.onBlur }
          : field
            ? {
                name: field.fieldName,
                ref: field.fieldRef as React.Ref<HTMLSelectElement>,
                onBlur: field.fieldOnBlur,
              }
            : {})}
        {...props}
        {...(value !== undefined ? { value } : {})}
        onChange={handleChange}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
      {!hideErrorMessage && error && (
        <p className="text-error mt-1 text-sm">{error.message}</p>
      )}
      {helperText && !error && (
        <p className="text-foreground-muted mt-1 text-sm">{helperText}</p>
      )}
    </div>
  );
}

export function Dropdown<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  ...rest
}: DropdownProps<TFieldValues>) {
  if (control && name) {
    return (
      <ControlledDropdownBridge control={control} name={name}>
        {(controllerProps) => (
          <DropdownInner<TFieldValues>
            {...rest}
            controllerProps={controllerProps}
          />
        )}
      </ControlledDropdownBridge>
    );
  }
  return <DropdownInner<TFieldValues> {...rest} />;
}
