import React, { useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { icons } from "@/public/assets/icons/icons";

type InputProp = {
  type: string;
  state?: "typing" | "success" | "error" | "readonly" | null;
  size?: "lg" | "sm";
  label?: string;
  hasLeftIcon?: boolean;
  hasRightIcon?: boolean;
  hasHelperText?: string;
  defaultValue?: any;
  placeholder?: string;
  rhk?: boolean;
  // ...props?: any
};

function InputComponent({
  type,
  state,
  size,
  label,
  hasLeftIcon,
  hasRightIcon,
  hasHelperText,
  defaultValue,
  placeholder,
  rhk,
  ...props
}: InputProp) {
  const [focus, setFocus] = useState(false);
  const [inputType, setInputType] = useState(type);

  const togglePassword = () =>
    inputType === "password" ? setInputType("text") : setInputType("password");
  return (
    <FormItem className="">
      <div className="space-y-1">
        {label && <FormLabel>{label}</FormLabel>}

        <div
          className={cn(
            "border h-11 rounded-md border-gray-300 dark:border-border-color px-3 flex items-center hover:border-blue-600 dark:hover:border-blue-600 duration-200",
            size === "lg" ? "h-14 px-4" : size === "sm" ? "h-9" : null,
            state === "error" ? "border-red-500" : null,
            state === "success" ? "border-green-500" : null,
            focus && !rhk ? "border-blue-600" : null
          )}
        >
          {hasLeftIcon ? "icon" : null}

          <FormControl>
            <Input
              type={inputType}
              defaultValue={defaultValue}
              placeholder={placeholder}
              className="border-none focus-visible:ring-0 rounded-none shadow-none px-1"
              onFocus={() => {
                setFocus(true);
              }}
              onBlur={() => {
                setFocus(false);
              }}
              {...props}
            />
          </FormControl>
          {hasRightIcon ? (
            <>
              {type === "email" ? (
                icons.mail_linear
              ) : type === "password" ? (
                <button type="button" onClick={togglePassword}>
                  {inputType === "password"
                    ? icons.eye_slash_linear
                    : icons.eye_linear}
                </button>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
      {hasHelperText && (
        <FormDescription>This is your public display name.</FormDescription>
      )}

      <FormMessage />
    </FormItem>
  );
}

export default InputComponent;
