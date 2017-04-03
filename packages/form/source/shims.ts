import {
  NgControl,
  ControlContainer,
  ControlValueAccessor,
  DefaultValueAccessor,
  CheckboxControlValueAccessor,
  SelectControlValueAccessor,
  SelectMultipleControlValueAccessor,
  RadioControlValueAccessor,
} from '@angular/forms';

export function controlPath(name: string, parent: ControlContainer): string[] {
  return [...parent.path, name];
}

export function selectValueAccessor(
    dir: NgControl, valueAccessors: ControlValueAccessor[]): ControlValueAccessor {
  if (!valueAccessors) return null;

  let defaultAccessor: ControlValueAccessor;
  let builtinAccessor: ControlValueAccessor;
  let customAccessor: ControlValueAccessor;
  valueAccessors.forEach((v: ControlValueAccessor) => {
    if (v.constructor === DefaultValueAccessor) {
      defaultAccessor = v;
    } else if (isBuiltInAccessor(v)) {
      if (builtinAccessor) {
        throw new Error(
          `More than one built-in value accessor matches form control with ${dir}`);
      }

      builtinAccessor = v;
    } else {
      if (customAccessor) {
        throw new Error(
          `More than one custom value accessor matches form control with ${dir}`);
      }
      customAccessor = v;
    }
  });

  if (customAccessor) return customAccessor;
  if (builtinAccessor) return builtinAccessor;
  if (defaultAccessor) return defaultAccessor;

  throw new Error(`No valid value accessor for form control with, ${dir}`);
}

const BUILTIN_ACCESSORS = [
  CheckboxControlValueAccessor,
  SelectControlValueAccessor,
  SelectMultipleControlValueAccessor,
  RadioControlValueAccessor,
];

export function isBuiltInAccessor(valueAccessor: ControlValueAccessor): boolean {
  return BUILTIN_ACCESSORS.some(a => valueAccessor.constructor === a);
}
