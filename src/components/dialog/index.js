import IDialog from './dialog'

IDialog.install = function (Vue) {
  Vue.component(IDialog.name, IDialog)
}

export default IDialog
