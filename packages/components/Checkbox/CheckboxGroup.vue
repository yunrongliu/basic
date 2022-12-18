<script setup name="BasicCheckboxGroup">
import { ref, reactive, watch, getCurrentInstance, provide } from 'vue'
import { getCheckboxUuid, useCheckBoxGroup } from './index'
import Checkbox from './index.vue'
const uuid = getCheckboxUuid()

defineOptions({
  name: 'BasicCheckboxGroup',
})
const props = defineProps({
  options: Array,
  bitKey: {
    type: String,
    default: 'value'
  },
  useBit: Boolean,
  useMutex: Boolean,
  mutexConfig: Array,
  modelValue: [Array, Number]
})


const { emit, slots } = getCurrentInstance()
const { useValue, isChecked, handleChange } = useCheckBoxGroup(props, emit)


defineEmits(['update:modelValue'])

provide('CheckboxGroup', {
  name: 'BasicCheckboxGroup',
  groupValue: reactive({ useValue }),
  isChecked,
  handleChange
})


</script>
<template>
  <section style="display: inline-flex;padding-left: 10px;">
    <template v-if="!slots.default">
      <Checkbox
          v-for="option in options"
          :key="option.value"
          :modelValue="isChecked(option[bitKey])"
          :disabled="option.disabled"
          @update:modelValue="handleChange([option.bitKey])">
        {{ option.text }}
      </Checkbox>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </section>
</template>
