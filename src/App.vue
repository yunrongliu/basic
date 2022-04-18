<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Table from './components/Table/index.vue'
import HelloWord from './components/HelloWorld.vue'
import Checkbox from './components/Checkbox/index.vue'
import CheckBoxGroup from './components/Checkbox/CheckboxGroup.vue'
import {ref, watch, reactive} from "vue";

let disabled = ref(false)
// let cbx_a = ref(true)
//
// watch(() => cbx_a.value, (val) => {
//   console.log('val', val)
// })

let cbxg_a = ref(2)
const options = [
  {
    value: 1,
    text: 'A'
  },
  {
    value: 2,
    text: 'B'
  },
  {
    value: 3,
    text: 'C'
  },
  {
    value: 4,
    text: 'D'
  }
]

const mutexConfig = [
  {
    type: 'compose',
    expression: 'A = B + C',
    left: 'A',
    right: ['B', 'C']
  },
  {
    type: 'mutex',
    expression: 'B ^ D',
    mutexes: ['B', 'D']
  }
]


let cbx_a = ref(false)

const handleChange = function (val, checkedItems) {
  console.log('val, checkedItems', val, checkedItems)
}

</script>

<template>
<!--  <button @click="disabled = false">disabled</button>-->
  <div>
    <Checkbox v-model="cbx_a" :indeterminate="true">all</Checkbox>
  </div>
<!--  <Checkbox v-if="show" text="B"/>-->
  <label>多选</label>
  <CheckBoxGroup
      v-model="cbxg_a"
      :options="options"
      :disabled="disabled"
      :useBit="true"
      :useMutex="true"
      :mutex-config="mutexConfig"
      @update:modelValue="handleChange">

    <Checkbox
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled">
      {{ option.text }}
    </Checkbox>
  </CheckBoxGroup>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
