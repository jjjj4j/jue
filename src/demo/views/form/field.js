import reg from '@/static/reg'

export default function (me) {
  return [
    {
      tag: 'el-input',
      name: 'name',
      disabled: !1,
      label: '名称',
      tip: '必填，支持中文、英文、数字输入，长度为1~64个字符',
      rules: [
        reg.required,
        {
          validator (rule, value, callback) {
            let reg = /^[\u0391-\uFFE50-9a-zA-Z]{1,64}$/
            if (!reg.test(value)) {
              callback(new Error('不符合输入规则，请重新输入！'))
            }
            callback()
          },
          trigger: 'change'
        }
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'groupId',
      label: '所属分组',
      emptyOption: !0,
      data: {
        props: {
          filterable: false,
          multiple: true,
          options: me.list
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'position',
      label: '安装位置',
      createFunction: 'formItem'
    },
    {
      tag: 'div',
      slot: 'exp'
    },
    {
      tag: 'el-input',
      name: 'otherParam',
      label: '其他参数',
      tip: '选填，可填写第三方认证系统与我方对接需要填写的必填信息，本系统不做特殊限制，支持1-64位英文、数字、特殊字符输入',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      type: 'textarea',
      name: 'comment',
      label: '描述',
      tip: '选填，最多128长度输入',
      rules: [
        reg.str128
      ],
      createFunction: 'formItem'
    }
  ]
}
