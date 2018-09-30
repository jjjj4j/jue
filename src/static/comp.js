// TODO 替换 webpack 默认的 Promise
require('babel-runtime/core-js/promise').default = window.Promise

import Vue from 'vue'

import TabLink from '@/comp/tabLink'
import Upload from '@/comp/upload'
import IDialog from '@/comp/dialog'
import EditDialog from '@/comp/editDialog'
import FormFactory from '@/comp/form'
import Permit from '@/comp/permit'
import EditPermit from '@/comp/editPermit'
import Jtree from '@/comp/jtree'
import Jtable from '@/comp/jtable'
import TimePicker from '@/comp/timePicker'
import EditTable from '@/comp/editTable'
import CfTable from '@/comp/cfTable'

Vue.use(TabLink)
Vue.use(Upload)
Vue.use(IDialog)
Vue.use(EditDialog)
Vue.use(FormFactory)
Vue.use(Permit)
Vue.use(EditPermit)
Vue.use(Jtree)
Vue.use(Jtable)
Vue.use(TimePicker)
Vue.use(EditTable)
Vue.use(CfTable)
