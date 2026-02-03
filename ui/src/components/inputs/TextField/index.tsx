"use client";

import { TEXT_INPUT_SIZE_CLASSES } from "@/constants/textField";
import { type TextFieldProps } from "@/types/textField";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { useCurrencyField } from "./useTextField";

export const TextField = ({
  label,
  error,
  icon,
  helperText,
  register,
  setValue,
  className = "",
  small,
  large,
  currency,
  value: initialValue,
  onChange: onChangeProps,
  type,
  ...props
}: TextFieldProps) => {
  const size = small ? "small" : large ? "large" : "default";
  const sizeConfig = TEXT_INPUT_SIZE_CLASSES[size];
  const inputRef = useRef<HTMLInputElement>(null);

  // Password visibility state
  const isPasswordType = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  // Determine the actual input type
  const inputType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : currency
      ? "text"
      : type;

  // Use the currency field hook for all currency-related logic
  const {
    displayValue,
    handleChange,
    handleBlur,
    handleFocus,
    getCurrencyLabel,
  } = useCurrencyField({
    currency,
    register,
    setValue,
    initialValue: typeof initialValue === "object" ? undefined : initialValue,
    onChange: onChangeProps,
    onBlur: props.onBlur,
    onFocus: props.onFocus,
    inputRef,
  });

  return (
    <div className="w-full">
      {label && (
        <label
          className={`text-foreground mb-2 block font-medium ${sizeConfig.label}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {currency && displayValue && (
          <div
            className={`text-foreground-muted pointer-events-none absolute font-medium ${sizeConfig.icon}`}
          >
            {getCurrencyLabel()}
          </div>
        )}
        {icon && !currency && (
          <div className={`text-foreground-muted absolute ${sizeConfig.icon}`}>
            {icon}
          </div>
        )}
        {/* Input field */}
        <input
          type={inputType}
          className={`bg-input-background text-input-text placeholder:text-input-placeholder w-full rounded-lg border-2 transition-all ${
            sizeConfig.input
          } ${currency && displayValue ? sizeConfig.inputWithIcon : ""} ${
            icon && !currency ? sizeConfig.inputWithIcon : ""
          } ${isPasswordType ? "pr-10" : ""} ${
            error
              ? "border-error focus:border-error focus:ring-error/30 focus:ring-2"
              : "border-input-border focus:border-input-border-focus focus:ring-input-border-focus/30 focus:ring-2"
          } ${
            props.disabled ? "cursor-not-allowed opacity-60" : ""
          } ${className}`}
          disabled={props.disabled}
          placeholder={props.placeholder}
          {...(currency
            ? {
                ref: inputRef,
                value: displayValue,
                onChange: handleChange,
                onBlur: handleBlur,
                onFocus: handleFocus,
                name: register?.name,
              }
            : {
                ...register,
                ...props,
                value: initialValue,
                onChange: onChangeProps,
              })}
          onInput={(e) => {
            if (register?.onChange && !currency) {
              register.onChange(
                e as unknown as React.ChangeEvent<HTMLInputElement>,
              );
            }
          }}
        />
        {/* Password visibility toggle */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-foreground-muted hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-error mt-1 text-sm">{error.message}</p>}
      {helperText && !error && (
        <p className="text-foreground-muted mt-1 text-sm">{helperText}</p>
      )}
    </div>
  );
};
