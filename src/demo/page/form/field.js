import reg from '@/static/reg'

export default function (me) {
  return [
    {
      tag: 'el-input',
      name: 'name',
      label: '名称',
      tip: '必填，支持中文、英文、数字输入，长度为1~64个字符',
      rules: [
        reg.required,
        /* reg.str64, */
        {
          validator (rule, value, callback) {
            var reg = /^[\u0391-\uFFE50-9a-zA-Z]{1,64}$/
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
      name: 'type',
      label: '类型',
      data: {
        props: {
          data: me.list
        }
      },
      tip: '选填，支持数字输入，长度为1~20位置数字',
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'code',
      label: '编号',
      tip: '选填，支持数字输入，长度为1~20位置数字',
      rules: [
        reg.int20
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'url',
      label: '系统地址',
      tip: '必填，第三方认证系统地址，支持IPv4校验规则',
      rules: [
        /* reg.uri */
        reg.required,
        reg.ip
      ],
      createFunction: 'formItem'
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
