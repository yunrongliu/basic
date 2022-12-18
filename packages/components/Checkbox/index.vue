<script lang="ts" setup name="BasicCheckbox">
import { getCurrentInstance } from 'vue'
import {getCheckboxUuid, useCheckBoxClassName} from './index'
import useCtrlItem from "@basic-ui/utils/use/ctrlItem"
import type {CheckboxProps} from "./checkbox.type";

const uuid = getCheckboxUuid()

defineOptions({
  name: 'BasicCheckbox',
})

const props:CheckboxProps = defineProps({
  modelValue: Boolean,
  value: [Number, String],
  disabled: Boolean,
  indeterminate: Boolean
})

const { emit } = getCurrentInstance()
const { useValue, handleChange, handleClick } = useCtrlItem(props, emit)
const className = useCheckBoxClassName(props)
</script>

<template>
  <label :for="uuid" :class="className" class="item" @click.stop="handleClick">
    <input v-model="useValue" type="checkbox" :id="uuid" class="hidden" @change="handleChange"/>
    <label :for="uuid" class="cbx">
      <svg width="14px" height="12px" viewBox="0 0 14 12">
        <polyline v-if="!indeterminate" points="1 7.6 5 11 13 1"></polyline>
        <circle v-else cx="7" cy="6.5" r="4.5" />
      </svg>
    </label>
    <label :for="uuid" class="cbx-lbl">
      <slot />
    </label>
  </label>
</template>

<style>
.item {
  user-select: none;
  transform: translateZ(0);
  padding-right: 11px;
}
.item.disabled {
  position: relative;
  filter: opacity(.5);
  pointer-events: none;
}
.item.disabled:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: not-allowed!important;
  pointer-events: auto;
}
.item .cbx {
  position: relative;
  top: 1px;
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1px solid #c8ccd4;
  border-radius: 3px;
  cursor: pointer;
}
.item .cbx svg {
  position: relative;
  top: -1px;
  transform: scale(0);
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.item .cbx svg polyline {
  stroke-width: 2;
  stroke: #18cda6;
}
.item .cbx svg circle {
  stroke-width: 2;
  stroke: #18cda6;
}
.item .cbx:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -10px 0 0 -10px;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background: #18cda6;
  transform: scale(0);
}
.item .cbx:after {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  width: 2px;
  height: 2px;
  border-radius: 2px;
  box-shadow: 0 -18px 0 #18cda6, 12px -12px 0 #18cda6, 18px 0 0 #18cda6, 12px 12px 0 #18cda6, 0 18px 0 #18cda6, -12px 12px 0 #18cda6, -18px 0 0 #18cda6, -12px -12px 0 #18cda6;
  transform: scale(0);
}
.item .cbx-lbl {
  position: relative;
  padding: 6px 6px 2px 6px;
  cursor: pointer;
  transition: color 0.3s ease;
}
.item .cbx-lbl:after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  width: 0;
  height: 2px;
  border-radius: 2px;
  background: #18cda6;
  transition: all 0.3s ease;
}
.item input {
  display: none;
}
.item input:checked + .cbx {
  border-color: transparent;
}
.item input:checked ~ .cbx-lbl {
  color: #18cda6;
}
.item input:checked + .cbx svg {
  transform: scale(1);
  transition: all 0.4s ease;
  transition-delay: 0.1s;
}
.item input:checked + .cbx:before {
  transform: scale(1);
  opacity: 0;
  transition: all 0.3s ease;
}
.item input:checked + .cbx:after {
  transform: scale(1);
  opacity: 0;
  transition: all 0.6s ease;
}
/*.item input:checked ~ .cbx-lbl {
//  color: #9098a9;
//}*/
.item input:checked ~ .cbx-lbl:after {
  width: 100%;
  transition: all 0.4s ease;
}
.item.indeterminate input:checked ~ .cbx-lbl:after {
  width: 0;
}
</style>
