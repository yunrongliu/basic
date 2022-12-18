<script setup lang="ts">
import { ref } from 'vue'
let disabled = ref(false)
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
    expression: 'A = B + C'
  },
  {
    type: 'mutex',
    expression: 'B ^ D',
    mutexes: ['B', 'D']
  }
]

const handleChange = function (val, checkedItems) {
  console.log('val, checkedItems', val, checkedItems)
}
</script>

<template>
  <Basic-Checkbox-Group
      v-model="cbxg_a"
      :options="options"
      :disabled="disabled"
      :useBit="true"
      :useMutex="true"
      :mutex-config="mutexConfig"
      @update:modelValue="handleChange">

    <Basic-Checkbox
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled">
      {{ option.text }}
    </Basic-Checkbox>
  </Basic-Checkbox-Group>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
