<script setup>
import { ref, reactive, watch, shallowRef } from 'vue'

const wrap$ = ref()
const $bar = ref()
const $bar_content = ref()
const data = shallowRef(Array.from({ length: 100 }).map((_, idx) => {
  return {
    id: idx,
    c: 'c',
    a: 'a',
    b: 'b',
    d: 'd',
    e: 'e',
    f: 'f'
  }
}))

const tableHeaderHeight = 200

const rowHeight = 30
const tableBodyClientHeight = 600
const tableBodyHeight = (rowHeight * data.value.length)

const ratio = tableBodyClientHeight / tableBodyHeight
const barContentHeight = tableBodyClientHeight * ratio
console.log('barContentHeight', barContentHeight)

function scrollRoll (e) {
  e = e || window.event;
  if (e.detail > 0) {
    down();
  } else if (e.detail < 0) {
    up();
  }

  if (e.wheelDelta > 0) {
    up();
  } else if (e.wheelDelta < 0) {
    down();
  }
}
const speed = 16
const times = (tableBodyHeight) / speed
const leftBarHeight = tableBodyClientHeight - barContentHeight
const bar_speed = leftBarHeight / times
console.log('bar_speed', bar_speed)
//滑轮向下滚动
function down () {
  const bar = $bar.value
  const add = wrap$.value.scrollTop + speed
  console.log(add, wrap$.value.offsetTop)
  if (add <= tableBodyHeight - tableBodyClientHeight) {
    bar.style.top = (bar.offsetTop + bar_speed ) + 'px'
    wrap$.value.scrollTop = add
  }
}
//滑轮向上滚动
function up () {
}


const handleScrollY = function (ev) {
  ev.preventDefault()
  ev.stopPropagation()
  scrollRoll(ev)
}


defineProps({
  msg: String
})

defineExpose({
  handleScrollY
})

</script>

<template>
  <div class="content">
    <div class="table-container">
      <div class="table-header">
      </div>
      <div style="position: relative;">
        <div ref="wrap$" class="table-body" @mousewheel="handleScrollY">
          <div v-for="(row) in data" class="row">
            {{ row.id }}
          </div>
        </div>
        <div class="y-scroll-container">
          <div ref="$bar" :style="{ height: (barContentHeight + 30) + 'px' }" class="y-scroll">
          </div>
        </div>
      </div>

      <!--    <div class="x-scroll-container">-->
      <!--      <div class="x-scroll">-->
      <!--      </div>-->
      <!--    </div>-->
    </div>
  </div>
</template>

<style>
.content {
  height: 800px;
  width: 1000px;
  border: #2c3e50 1px solid;
}
.table-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.table-header {
  background: aquamarine;
  height: 200px;
}
.table-body {
  overflow: auto;
  width: calc(100% + 16px);
  height: 600px;
}
.row {
  height: 30px;
}
.y-scroll-container {
  position: absolute;
  top: 0px;
  right: 0;
  height: 100%;
  width: 4px;
}
.y-scroll {
  position: absolute;
  top: 0;
  background: #42b983;
  width: 4px;
  height: 20px;
}
</style>
