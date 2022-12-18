import { reactive, watch, ref, computed } from "vue";

let uid:number = 0
/*
* 生成唯一ID，用于在label元素上设置for属性
* */
export function getCheckboxUuid():string {
  return 'bs_cb' + (uid++)
}

/*
* 用于获取checkbox在勾选以及禁用时的className
* */
export function useCheckBoxClassName(props: checkboxProps) {
  const { disabled,
    indeterminate } = props
  const className = reactive({
    disabled,
    indeterminate
  })
  watch(() => [props.disabled, props.indeterminate], ([disabled, indeterminate]) => {
    className.disabled = disabled
    className.indeterminate = indeterminate
  })
  return className
}

/*
*
* 由于多选勾选时可以通过id(1、2、3)左移1位(相当于2的n次方)然后进行|(或)运算，也就是相加得到一个int，可以使保存的时候传递较少的字段
* 并且id通过左移后得到的数字一定可以整除2，所以可以用来做互斥处理，也就是单选项间存在互斥关系，比如A、B互斥，选了A后，再选择B就会把A自动清除
* 因为该方式实现起来较为简单，所以使用这种方式
* */

/*
* 生成bitMap, 用于映射选项id值和对应的左移值
* option: {
*   [any]key: 1
* }
* bitKey: *key
*
* @return Map{ number: Math.pow(2, number)) }
* */
function genBitMap(options: Array<CheckBoxOption>, bitKey: string) {
  return options.reduce((ret, option, idx) => {
    const id = option[bitKey] || (idx + 1)
    ret.set(id, 1 << id)

    return ret
  }, new Map())
}

/*
* 生成mutexMap, 用于映射选项id值和对应的互斥值
* ^表示互斥
* option: {
*   [any]key: 1
* }
* mutexConfigs： {
*  type: ['compose','mutex']
*  left: targetText
*  right: [mutexTextA, mutexTextB……]
* }
*
* expression: 用表达式来表示left right
* on 'compose': left = mutexTextA + mutexTextB
*   left ^ mutexTextA
*   left ^ mutexTextB
* on 'mutex': left ^ mutexTextA ^ mutexTextB
*
*
* bitKey: *key
*
* @return Map{ number: Math.pow(2, number)) }
* */
const genMutexMap = function (options, mutexConfigs, bitKey, mutexKey = 'text') {
  const mutexTextToIdMap = new Map() // Map { 'A': id }
  options.forEach((option) => {
    mutexTextToIdMap.set(option[mutexKey], option[bitKey])
  })
  const mutexMap = new Map() // Map { 'A': mutexNumber }

  const getLeftOneBitValue = function (mutexText) {
    return (1 << mutexTextToIdMap.get(mutexText))
  }

  const updateMutex = function (selfMutexText, mutexText) {
    const id = mutexTextToIdMap.get(selfMutexText)
    let value = mutexMap.get(id) || 0
    // init
    if (value === 0) {
      value = getLeftOneBitValue(selfMutexText)
    }
    // add
    mutexMap.set(id, value | getLeftOneBitValue(mutexText))
  }

  mutexConfigs.forEach((mutexConfig) => {
    if (mutexConfig.type === 'compose') {
      let leftMutexText = mutexConfig.left
      mutexConfig.right.forEach((mutexText) => {
        updateMutex(leftMutexText, mutexText)
        updateMutex(mutexText, mutexConfig.left)
      })
    } else if (mutexConfig.type === 'mutex') {
      mutexConfig.mutexTextList.forEach((mutexText) => {
        mutexConfig.mutexTextList.forEach(mutexText2 => {
          if (mutexText !== mutexText2) {
            updateMutex(mutexText, mutexText2)
          }
        })
      })
    }
  })

  return mutexMap
}

const isMutex = function (mutexValA, mutexValB) {
  return (mutexValA & mutexValB) > 0
}

/*
* 生成bit模式下所需要的通用变量和函数
* */
const genBit = function (props) {
  const { bitKey = 'value', options, modelValue } = props
  const bitMap = genBitMap(options, bitKey)
  const checkedSet = reactive(new Set([]))
  const useValue = ref(modelValue)

  const isChecked = function (val) {
    return !!(bitMap.get(val) & useValue.value)
  }

  const getCheckedItem = function() {
    return options.filter((checkBox) => isChecked(checkBox[bitKey]))
  }

  const getCheckedValue = function() {
    let ret = 0
    checkedSet.forEach((val) => {
      ret = ret | bitMap.get(val)
    })
    return ret
  }

  return {
    getCheckedItem,
    getCheckedValue,
    isChecked,
    useValue,
    bitMap,
    checkedSet
  }
}

const resolveComposeRegExp = /\w+/g
const resolveMutexRegExp = /\w+/g
const resolveMutexConfig = function (mutexConfig) {
  mutexConfig.forEach((config) => {
    if (config.type === 'compose') {
      const expression = config.expression.match(resolveComposeRegExp)
      config.left = expression[0]
      config.right = expression.slice(1)
    } else if (config.type === 'mutex') {
      const expression = config.expression.match(resolveMutexRegExp)
      config.mutexTextList = expression
    }
  })
}

const useMutex = function (props, emit) {
  const { bitKey = 'value', options, mutexConfig } = props
  resolveMutexConfig(mutexConfig)
  const mutexMap = genMutexMap(options, mutexConfig, bitKey)
  const { useValue, checkedSet, isChecked, getCheckedItem, getCheckedValue, bitMap } = genBit(props)

  const updateCheckedSet = function (currentOptionId) {
    if (checkedSet.has(currentOptionId)) {
      checkedSet.delete(currentOptionId)
    } else {
      // 如果在选中时已经存在其他的选中值，判断是否有互斥值已被勾选，有则删除
      if (checkedSet.size > 0) {
        const mutexValue = mutexMap.get(currentOptionId)
        checkedSet.forEach((optionId) => {
          if (isMutex(bitMap.get(optionId), mutexValue)) {
            checkedSet.delete(optionId)
          }
        })
      }
      checkedSet.add(currentOptionId)
    }
  }

  getCheckedItem().forEach((option) => {
    updateCheckedSet(option[bitKey])
  })

  watch(() => checkedSet, () => {
    useValue.value = getCheckedValue()
    emit('update:modelValue', useValue.value, getCheckedItem())
  }, { deep: true })

  return {
    useValue,
    isChecked,
    getCheckedItem,
    getCheckedValue,
    handleChange: updateCheckedSet
  }
}

// 是否采用位运算来存储checkBoxGroup的选中值
const useBit = function (props, emit) {
  const { bitKey = 'value' } = props

  const { useValue, checkedSet, isChecked, getCheckedItem, getCheckedValue } = genBit(props)

  const setCheckedValue = function (val) {
    checkedSet.has(val) ? checkedSet.delete(val) : checkedSet.add(val)
  }

  // 初始化 checkedSet
  getCheckedItem().forEach((item) => {
    checkedSet.add(item[bitKey])
  })

  watch(() => checkedSet, () => {
    useValue.value = getCheckedValue()
    emit('update:modelValue', useValue.value, getCheckedItem())
  }, { deep: true })


  return {
    useValue,
    isChecked,
    getCheckedItem,
    getCheckedValue,
    handleChange: setCheckedValue
  }

}

const useNormal = function (props, emit) {
  const checkedSet = reactive(new Set([]))

  const setCheckedValue = function (val) {
    checkedSet.has(val) ? checkedSet.delete(val) : checkedSet.add(val)
  }

  const isChecked = function (val) {
    return checkedSet.has(val)
  }

  watch(() => checkedSet, () => {
    emit('update:modelValue', [...checkedSet.values()])
  }, { deep: true })

  return {
    handleChange: setCheckedValue,
    isChecked
  }
}

export const useCheckBoxGroup = function (props, emit) {
  if (props.useMutex) {
    return useMutex(props, emit)
  } else if (props.useBit) {
    return useBit(props, emit)
  } else {
    return useNormal(props, emit)
  }
}



