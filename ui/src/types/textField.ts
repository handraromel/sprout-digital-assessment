import { type FieldError, type UseFormRegisterReturn } from "react-hook-form";

export interface CurrencyConfig {
  symbol: string;
  position?: "prefix" | "suffix";
  decimals?: number;
}

export type SetValueFn = (
  name: string,
  value: unknown,
  options?: { shouldValidate?: boolean; shouldDirty?: boolean },
) => void;

export interface TextFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: FieldError;
  icon?: React.ReactNode;
  helperText?: string;
  small?: boolean;
  large?: boolean;
  register?: UseFormRegisterReturn;
  setValue?: SetValueFn;
  currency?: CurrencyConfig;
}
