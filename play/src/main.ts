import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import BasicCheckboxGroup from '@basic-ui/components/Checkbox/export.checkboxGroup'
import BasicCheckbox from '@basic-ui/components/Checkbox/export'

// 组件库
const components = [BasicCheckboxGroup, BasicCheckbox]
// 是否已安装标识
const INSTALLED_KEY = Symbol('INSTALLED_KEY')
// 组件库插件
const BASIC = {
  install(app: any) {
    // 如果该组件库已经安装过了，则不进行安装
    if (app[INSTALLED_KEY]) return
    // 将标识值设置为 true，表示已经安装了
    app[INSTALLED_KEY] = true
    // 循环组件库中的每个组件进行安装
    components.forEach((c) => {
      console.log('c', c)
      app.use(c)
    })
  },
}


const app = createApp(App)

app.use(BASIC)

app.mount('#app')
