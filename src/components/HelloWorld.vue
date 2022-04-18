<script setup>
import { ref, reactive, watch } from 'vue'

const LayoutCtrlItems = reactive([
  {
    ctrlType: 'input',
    label: 'A',
    value: 11
  },
  {
    ctrlType: 'input',
    label: 'B',
    value: 2
  },
  {
    ctrlType: 'text',
    label: 'C',
    value: 22,
    calc: {
      deps: ['B', 'A'],
      funcText: `return vars['B'].value * vars['A'].value`
    }
  },
])
const getDeps = function (deps) {
  return LayoutCtrlItems.filter((ctrlItem) => deps.includes(ctrlItem.label))
}
LayoutCtrlItems.forEach((ctrlItem) => {
  if (ctrlItem.calc) {
    const ctrlItemsInDeps = getDeps(ctrlItem.calc.deps)
    const run = new Function('vars', ctrlItem.calc.funcText)
    watch(() => [ctrlItemsInDeps.map((ctrlItem) => ctrlItem.value)], () => {
      console.log('ccc', LayoutCtrlItems[0].value, LayoutCtrlItems[1].value)
      ctrlItem.value = run({
        'A': {
          value: LayoutCtrlItems[0].value
        },
        'B': {
          value: LayoutCtrlItems[1].value
        }
      })
    })
  }
})

// watch(LayoutCtrlItems[0].value, (val, oldVal) => {
//   console.log(val, oldVal)
// })

defineProps({
  msg: String
})

</script>

<template>
  <div v-for="(ctrlItem) in LayoutCtrlItems">
    <section :key="ctrlItem.label">
      <input v-if="ctrlItem.ctrlType === 'input'" type="number" v-model="ctrlItem.value" />
      <p v-else>{{ ctrlItem.value }}</p>
    </section>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
