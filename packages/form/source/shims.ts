import {
  ControlContainer,
  ControlValueAccessor,
  CheckboxControlValueAccessor,
  SelectControlValueAccessor,
  SelectMultipleControlValueAccessor,
  RadioControlValueAccessor,
} from '@angular/forms';

export function controlPath(name: string, parent: ControlContainer): string[] {
  return [...(parent.path || []), name];
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
