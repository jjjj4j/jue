import Vue from 'vue'

import Input from '@/elext/input'
import Radio from 'element-ui/packages/radio/index.js'
import RadioGroup from 'element-ui/packages/radio-group/index.js'
import Checkbox from 'element-ui/packages/checkbox/index.js'
import CheckboxGroup from 'element-ui/packages/checkbox-group/index.js'
import Switch from 'element-ui/packages/switch/index.js'
import Button from 'element-ui/packages/button/index.js'
import ButtonGroup from 'element-ui/packages/button-group/index.js'
import Form from 'element-ui/packages/form/index.js'
import FormItem from 'element-ui/packages/form-item/index.js'
import Loading from 'element-ui/packages/loading/index.js'
import Upload from 'element-ui/packages/upload/index.js'
import Pagination from 'element-ui/packages/pagination/index.js'

import Select from '@/elext/select/index.js'
import Option from '@/elext/option/index.js'
import DatePicker from '@/elext/date-picker'
import TimePicker from '@/elext/time-picker'

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
