import Vue from 'vue'

import Radio from 'element-ui/packages/radio/index.js'
import RadioGroup from 'element-ui/packages/radio-group/index.js'
import Checkbox from 'element-ui/packages/checkbox/index.js'
import CheckboxGroup from 'element-ui/packages/checkbox-group/index.js'
import Switch from 'element-ui/packages/switch/index.js'
import Button from 'element-ui/packages/button/index.js'
import ButtonGroup from 'element-ui/packages/button-group/index.js'
import Loading from 'element-ui/packages/loading/index.js'
import Upload from 'element-ui/packages/upload/index.js'
import Pagination from 'element-ui/packages/pagination/index.js'

import Form from '@/elext/form'
import FormItem from '@/elext/form-item'
import Input from '@/elext/input'
import Select from '@/elext/select/index.js'
import Option from '@/elext/option/index.js'
import DatePicker from '@/elext/date-picker'
import TimePicker from '@/elext/time-picker'

import Dropdown from 'element-ui/packages/dropdown/index.js'
import DropdownMenu from 'element-ui/packages/dropdown-menu/index.js'
import DropdownItem from 'element-ui/packages/dropdown-item/index.js'

import Cascader from 'element-ui/packages/cascader/index.js'
import Notification from 'element-ui/packages/notification/index.js'
import MessageBox from 'element-ui/packages/message-box/index.js'
import { isPlainObject, noop } from '@/util/core'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Upload)
Vue.use(Loading)
Vue.use(Pagination)

Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(TimePicker)

Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

Vue.use(Cascader)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification

Vue.mixin({
  methods: {
    msg (result) {
      let text = result
      let fnName = this.$notify.warning
      if (isPlainObject(result)) {
        if (result.code === 200) {
          fnName = this.$notify.success
        } else {
          fnName = this.$notify.error
        }
        text = result.message || result.data.message
      }
      fnName({
        title: '提示',
        message: text,
        duration: 10000
      })
    },
    confirm (text, success, fail) {
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(success || noop).catch(fail || noop)
    }
  }
})
