import type { ExtractPropTypes, PropType } from 'vue'
export const checkboxProps = {
  modelValue: Boolean,
  value: [Number, String] as PropType<number, string>,
  disabled: Boolean,
  indeterminate: Boolean
}

export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>

/*
* checkboxOption用来描述每一个项中的值与文本
* value与text为默认的key
* 允许用户传入任意key进行描述，但在checkboxGroupProps需要指导才能进行映射
*/
export type CheckBoxOption = {
    [key: string]: string
}
export type MutexConfigItem = {
  type: string,
  expression: string,
  mutexes: [string]
}
export const checkboxGroupProps = {
  options: Array as PropType<CheckBoxOption>,
  bitKey: String,
  useBit: Boolean,
  useMutex: Boolean,
  mutexConfig: Array as PropType<MutexConfigItem>,
  modelValue: [Array, Number] as PropType<Array<number>, Number>
}

export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>
