import { ref, watch, inject } from "vue";

const handleChange = function (emit, useValue) {
  return function (e) {
    emit('update:modelValue', useValue.value, e)
  }
}

const handleClick = function (props) {
  return function (e) {
    if (props.disabled) {
      e.preventDefault()
    }
  }
}

const handleClear = function (useValue, props) {
  return function () {
    if (!props.disabled) {
      useValue.value = ''
    }
  }

}

const SIZE_DICT = {
  'd': '30vw',
  'z': '20vw',
  'x': '10vw'
}
const useSize = function (props) {
  const { size } = props

  return SIZE_DICT[size] || ''
}

const useCtrlItem = function (props, emit) {
  const useValue = ref(props.modelValue)

  const checkboxGroup = inject('CheckboxGroup', {})
  if (checkboxGroup.groupValue) {
    useValue.value = checkboxGroup.isChecked(props.value)
    watch(() => checkboxGroup.groupValue.useValue, () => {
      useValue.value = checkboxGroup.isChecked(props.value)
    })
  } else {
    watch(() => props.modelValue, (val) => {
      useValue.value = val
    })
  }


  return {
    useSize: useSize(props),
    handleClear: handleClear(useValue, props),
    useValue,
    handleChange: checkboxGroup.handleChange ? checkboxGroup.handleChange.bind(null, props.value) : handleChange(emit, useValue),
    handleClick: handleClick(props)
  }
}


export default useCtrlItem
