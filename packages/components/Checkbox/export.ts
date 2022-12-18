// 用来整合组件的，最终实现导出组件

import { withInstall } from '@basic-ui/utils'
import CheckBox from './index.vue'

// 通过 withInstall 方法给 Icon 添加了一个 install 方法
const BasicCheckBox = withInstall(CheckBox)
// 可以通过 app.use 来使用，也可以通过 import 方式单独使用
export default BasicCheckBox
export * from './index'
