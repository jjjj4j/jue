import reg from '@/static/reg'
import VideoLimit from './videoLimit'
import EditPermit from '@/components/editPermit'
import { extend, isUndefined } from '@/util/core'
import { each } from '@/util/array'

let _TRIGGER_ = 'change'
let required = function (model, msg, trigger) {
  return {
    validator (rule, value, callback) {
      if (isUndefined(model.id)) {
        if (value === '' || value === undefined) {
          callback(new Error(msg || '此处为必填项'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    required: !model.id,
    trigger: trigger || _TRIGGER_
  }
}
export default function (me) {
  let list = each([
    {
      tag: 'el-select',
      name: 'type',
      label: '用户属性',
      rules: [
        reg.required
      ],
      change () {
        me.$nextTick(() => {
          me.editPermit().init()
        })
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'loginName',
      label: '用户名',
      tip: [
        '必填，长度为1~64个字符',
        '支持输入数字、字母、“@”、“.”、“-”、“_”',
        '在节点内或单位管理级联管理后不能重复'
      ],
      rules: [
        reg.required,
        {
          validator (rule, value, callback) {
            var reg = /^[0-9a-zA-Z@\\.\-_]{1,64}$/
            if (!reg.test(value)) {
              callback(new Error('不符合规则，请重新输入！'))
            }
            callback()
          },
          trigger: 'change'
        },
        reg.remote({
          id: me.model.id,
          name: 'loginName',
          api: 'checkUserName',
          apiPrefix: me.ApiPrefix(),
          msg: '用户名已存在,请重新填写'
        })
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      type: 'password',
      name: 'password',
      label: '密码',
      tip: [
        '由数字、字符、特殊字符三种中的两种组成， 不可使用 "&" 和 "#"',
        '长度为6~30个字符',
        '键盘用户请使用纯数字密码',
        '选择其他认证方式后选填（PKI、指纹）'
      ],
      rules: [
        required(me.model),
        reg.password,
        {
          validator (rule, value, callback) {
            if (value.match(/[#&]/g)) {
              callback(new Error('密码中不能使用字符 "#", "&"'))
            }
            callback()
          },
          trigger: 'change'
        }
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-cascader',
      name: 'orgId',
      label: '所属组织机构',
      tip: '必选，请选择节点内组织',
      rules: [
        reg.required
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'name',
      label: '真实姓名',
      tip: '必填，支持中文、英文输入，长度为1~64个字符',
      rules: [
        reg.required,
        {
          validator (rule, value, callback) {
            var reg = /^[\u0391-\uFFE50-9a-zA-Z]{1,64}$/
            if (!reg.test(value)) {
              callback(new Error('不符合规则，请重新输入！'))
            }
            callback()
          },
          trigger: 'change'
        }
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'level',
      label: '用户操作抢占级别',
      tip: '支持数字范围为1~1000，1为最低级别，1000为最高级别',
      rules: [
        reg.required,
        reg.num1000
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'userCode',
      label: '键盘编号',
      tip: '选填，用户通过键盘控制系统时登录的用户名，仅支持数字输入，支持1-10位数字输入',
      rules: [
        reg.int10
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'gbId',
      label: '国标编号',
      tip: '选填，sipclient登录时用到的国标编号，国标自测时使用，仅支持20位数字输入',
      rules: [
        reg.gbId,
        reg.remote({
          id: me.model.id,
          name: 'gbId',
          api: 'checkUserGbId',
          apiPrefix: me.ApiPrefix(),
          msg: '国标编号已存在,请重新填写'
        })
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'div',
      data: {
        class: {
          'form-title': true
        }
      },
      children: ['权限微调']
    },
    {
      tag: 'el-checkbox-group',
      name: 'permitRepeatLogin',
      createFunction: 'formItem'
    },
    {
      tag: EditPermit,
      label: '权限选择',
      data: {
        ref: 'editPermit',
        props: {
          type: 'user',
          model: me.model
        }
      },
      createFunction: 'comp4form'
    },
    {
      tag: 'div',
      data: {
        class: {
          'form-title': true
        }
      },
      children: ['个人信息']
    },
    {
      tag: 'el-input',
      name: 'idCardNo',
      label: '身份证',
      tip: '选填，中国公民身份证号码，支持15位和18位数字，支持18位身份证号码中最后一位为"X"',
      rules: [
        reg.id,
        reg.remote({
          id: me.model.id,
          name: 'idCardNo',
          api: 'checkUserIdCardNo',
          apiPrefix: me.ApiPrefix(),
          msg: '身份证号已存在,请重新填写'
        })
      ],
      data: {
        on: {
          blur (e) {
            let idCard = e.target.value,
              sexNum = 1,
              isValid = reg.str18.pattern.test(idCard)

            if (isValid) {
              if (idCard.length > 15) {
                sexNum = idCard.substr(idCard.length - 2, 1)
              } else {
                sexNum = idCard.substr(idCard.length - 1, 1)
              }
              me.model.sex = sexNum % 2 === 1 ? 0 : 1
            }
          }
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-radio-group',
      name: 'sex',
      label: '性别',
      tip: '选填，支持根据身份证号计算性别，没有输入身份证号码时支持手动选择',
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'phoneNo',
      label: '手机号码',
      tip: [
        '选填， 支持数字输入 ', 
        '考虑非中国地区用户使用规则， 支持1~20位数字输入'
      ],
      rules: [
        reg.int20
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'tel',
      label: '电话号码',
      tip: [
        '选填，支持数字、"-"输入',
        '考虑非中国地区用户使用规则，支持1-20位长度输入'
      ],
      rules: [
        reg.phone
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'email',
      label: '电子邮箱',
      tip: '选填，支持数字、英文（大小写）、“@”、“.”“-”“_”字符输入',
      rules: [
        reg.email
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-date-picker',
      type: 'datetimerange',
      name: 'timerRange',
      label: '有效期',
      tip: '选填，用户在系统中的有效期',
      data: {
        props: {
          format: 'yyyy-MM-dd HH:mm:ss',
          rangeSeparator: ' 至 ',
          pickerOptions: {
            shortcuts: [
              {
                text: '未来一周',
                onClick (picker) {
                  picker.$emit('pick', [new Date(), window.moment().add(7, 'd').toDate()])
                }
              }, {
                text: '未来一个月',
                onClick (picker) {
                  picker.$emit('pick', [new Date(), window.moment().add(1, 'M').toDate()])
                }
              }, {
                text: '未来三个月',
                onClick (picker) {
                  picker.$emit('pick', [new Date(), window.moment().add(3, 'M').toDate()])
                }
              }, {
                text: '未来一年',
                onClick (picker) {
                  picker.$emit('pick', [new Date(), window.moment().add(1, 'y').toDate()])
                }
              }, {
                text: '未来俩年',
                onClick (picker) {
                  picker.$emit('pick', [new Date(), window.moment().add(2, 'y').toDate()])
                }
              }]
          }
        }
      },
      createFunction: 'formItem'
    },
    {
      tag: 'div',
      data: {
        class: {
          'form-title': true
        }
      },
      children: ['个人业务']
    },
    {
      tag: 'el-input',
      name: 'maxWay',
      label: '最大浏览',
      tip: '支持整数数字输入，最小为1，最大为节点内摄像机路数',
      default: 4,
      rules: [
        reg.maxWay
      ],
      children: [
        {
          tag: 'template',
          data: {
            slot: 'append'
          },
          children: ['路']
        }
      ],
      createFunction: 'formItem'
    },
    {
      tag: VideoLimit,
      data: {
        props: {
          model: me.model
        }
      }
    },
    {
      tag: 'div',
      data: {
        class: {
          'form-title': true
        }
      },
      children: ['认证方式']
    },
    {
      tag: 'el-input',
      name: 'exUserId',
      label: 'PKI编号',
      tip: '按照PKI给出的用户编号进行输入，本系统不做限制',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'edit-table',
      label: 'MAC地址绑定',
      tip: '选填，示例： 00:A3:19:EF:E4:24，支持数字、字母输入、“:”',
      data: {
        ref: 'safeMac',
        style: {
          width: '500px'
        },
        props: {
          list: me.model.safeMac,
          setting: me.etMac
        }
      },
      createFunction: 'comp'
    },
    {
      tag: 'edit-table',
      label: 'IP地址绑定',
      tip: '选填，请输入IP地址，IPv4验证规则',
      data: {
        ref: 'ip',
        style: {
          width: '500px'
        },
        props: {
          list: me.model.ip,
          setting: me.etIp
        }
      },
      createFunction: 'comp'
    },
    {
      tag: 'edit-table',
      label: 'IP地址段绑定',
      tip: '选填，支持连续IP地址的开始IP-结束IP的输入，IPv4验证规则',
      data: {
        ref: 'ipRange',
        style: {
          width: '641px'
        },
        props: {
          list: me.model.ipRange,
          setting: me.etIpRange
        }
      },
      createFunction: 'comp'
    }
  ], (item) => {
    if (me.isMe()) {
      let list = [
        'loginName',
        'orgId',
        'name',
        'level',
        'roleIds',
        'timerRange',
        'maxWay',
        'exUserId'
      ]
      if (list.indexOf(item.name) >= 0) {
        extend(item, {
          data: {
            props: {
              disabled: true
            }
          }
        })
      }
    }
  })
  
  if (me.model.type === 1) {
    return [
      list[0],
      list[1],
      list[2],
      list[3],
      list[8],
      list[9],
      list[10],
      list[11],
      list[5],
      list[21],
      list[18]
    ]
  }
  
  return list
}
