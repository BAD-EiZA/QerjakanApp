"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import Select from "react-select";

export type SelectorValue = {
  label: string;
  value: string;
};

interface SelectProps {
  value?: SelectorValue;
  onChange: (value: SelectorValue) => void;
  fillOptions: any[];
  placeHolder: string;
  required?: boolean;
  errors: FieldErrors;
  idSelector: string;
  register: UseFormRegister<FieldValues>;
}

const Selector: React.FC<SelectProps> = ({
  value,
  onChange,
  fillOptions,
  placeHolder,
  required,
  idSelector,
  register,
  errors,
}) => {
  return (
    <div>
      <Select
        id={idSelector}
        placeholder={placeHolder}
        className={`border rounded
        ${errors[idSelector] ? "border-rose-500" : "border-neutral-300"}
        ${errors[idSelector] ? "focus:border-rose-500" : "focus:border-black"}`}
        options={fillOptions}
        value={value}
        {...register(idSelector, { required })}
        onChange={(value) => onChange(value as SelectorValue)}
        formatOptionLabel={(option: any) => (
          <div
            className="
          flex flex-row items-center gap-3"
          >
            <div>{option.label}</div>
          </div>
        )}
      />
    </div>
  );
};

export default Selector;
