import reg from '@/static/reg'
import { getProtocol } from '@/util/protocol'
import { extend, isNumber, isUndefined } from '@/util/core'
import { ip } from '@/util/form'
import { tpl } from '@/util/char'

export default function (me, formType = 'add') {
  let initUserInfo = function (value) {
    let model = me.model
    let form = me.getForm()
    let pro = getProtocol(value)
    /* 联动修改 端口号，用户名，密码 */
    if (pro) {
      form.resetField('port', model.port = pro.port)
      form.resetField('username', model.username = pro.username)
      form.resetField('password', model.password = pro.password)
    }
  }

  let _TRIGGER_ = 'change'
  let required = function (model, msg, trigger) {
    return {
      validator (rule, value, callback) {
        let isRequired = model.protocol !== 'siphost'
        if (isRequired) {
          if (value === '' || value === undefined) {
            callback(new Error(msg || '此处为必填项'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      required () {
        return model.protocol !== 'siphost'
      },
      trigger: trigger || _TRIGGER_
    }
  }

  let required2 = function (model, msg, trigger) {
    return {
      validator (rule, value, callback) {
        let isRequired = model.protocol === 'siphost'
        if (isRequired) {
          if (value === '' || value === undefined) {
            callback(new Error(msg || '此处为必填项'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      required () {
        return model.protocol === 'siphost'
      },
      trigger: trigger || _TRIGGER_
    }
  }

  let show = (isGb, tab) => {
    if (formType === 'add') {
      return (me.model.protocol === 'siphost') === isGb && (!tab || me.tab === tab)
    } else {
      return !0
    }
  }

  let groupId = {
    tag: 'el-cascader',
    name: 'groupId',
    label: '所属分组',
    tip: '在本系统中摄像机所属的资源分组',
    rules: [
      reg.required
    ],
    createFunction: 'formItem'
  }
  let name = {
    tag: 'el-input',
    name: 'name',
    label: '名称',
    tip: '必填，1-64字符，支持中文、英文、数字、特殊字符输入，系统默认使用设备IP/国标编号作为设备名称',
    rules: [
      reg.str64
    ],
    createFunction: 'formItem'
  }
  let useType = {
    tag: 'el-select',
    name: 'useType',
    label: '应用类别',
    tip: '只有与模拟平台对接时，模拟平台视频通过选择编码通道接入本系统，其他情况均选择摄像机',
    createFunction: 'formItem'
  }

  let useType4edit = extend({
    data: {
      props: {
        disabled: true
      }
    }
  }, useType, {
    tip: '不可修改，与模拟平台对接时，模拟平台视频通过选择编码通道接入本系统，其他情况均选择摄像机'
  })

  let protocol = {
    tag: 'el-select',
    name: 'protocol',
    label: '接入协议',
    tip: '摄像机接入本系统的协议类型，通过此协议实现本系统与前端摄像机的对接',
    rules: [
      reg.required
    ],
    change (value) {
      if (me.initProtocolEvent || isUndefined(me.model.id)) {
        initUserInfo(value)
      }
    },
    createFunction: 'formItem'
  }
  let protocol4edit = extend({
    data: {
      props: {
        disabled: me.model.protocol === 'siphost'
      }
    }
  }, protocol)
  let username = {
    tag: 'el-input',
    name: 'username',
    label: '用户名',
    tip: '设备登录用户名',
    rules: [
      reg.required,
      reg.str64
    ],
    show () {
      return me.model.protocol !== 'siphost'
    },
    createFunction: 'formItem'
  }
  let password = {
    tag: 'el-input',
    name: 'password',
    label: '密码',
    tip: '设备登录密码',
    default: '123456',
    rules: [
      required(me.model),
      reg.str32
    ],
    createFunction: 'formItem'
  }
  let port = {
    tag: 'el-input',
    name: 'port',
    label: '端口号',
    tip: '设备端口号',
    rules: [
      reg.required,
      reg.port
    ],
    createFunction: 'formItem'
  }
  let gbId = {
    tag: 'el-input',
    name: 'gbId',
    label: '设备国标编号',
    tip: '国标接入设备必填，填写设备国标编号，支持20位及以下数字输入',
    rules: [
      required2(me.model),
      reg.gbId,
      reg.remote({
        id: me.model.id || '',
        name: 'gbId',
        api: 'checkDeviceGb',
        msg: '国标编号已存在，请重新填写'
      })
    ],
    show () {
      if (formType === 'add') {
        return me.tab === 'first'
      }
      return !0
    },
    createFunction: 'formItem'
  }
  let startGbId = {
    tag: 'el-input',
    name: 'startGbId',
    label: '起始国标编号',
    tip: '在批量添加国标设备时，按顺序（从小到大）第一个起始编号',
    rules: [
      reg.required,
      reg.gbId
    ],
    show: () => {
      return show(!0, 'second')
    },
    createFunction: 'formItem'
  }
  let gbIdStep = {
    tag: 'el-input',
    name: 'gbIdStep',
    label: '相邻编号差值',
    tip: '在批量添加国标设备时，相邻的两个国标编号插值（仅支持插值一致的设备添加，如差1）',
    rules: [
      reg.required,
      reg.num1000
    ],
    show: () => show(!0, 'second'),
    createFunction: 'formItem'
  }
  let gbIdTimes = {
    tag: 'el-input',
    name: 'gbIdTimes',
    label: '数量',
    tip: '批量添加的国标设备个数',
    rules: [
      reg.required,
      reg.num3000
    ],
    show: () => show(!0, 'second'),
    createFunction: 'formItem'
  }
  let startIp = {
    tag: 'el-input',
    name: 'startIp',
    label: '开始地址',
    tip: '批量添加私有协议设备的开始IP地址',
    rules: [
      reg.required,
      reg.ip
    ],
    change (e) {
      me.model.endIp = e
      me.getForm().resetField('channelNum', 1)
    },
    show: () => show(!1, 'second'),
    createFunction: 'formItem'
  }
  let endIp = {
    tag: 'el-input',
    name: 'endIp',
    label: '结束地址',
    tip: '批量添加私有协议设备的结束IP地址，添加时按照开始及结束IP逐个增加',
    rules: [
      reg.required,
      reg.ip,
      {
        validator (rule, value, callback) {
          let ipReg = reg.ip.pattern
          let startIp = me.model.startIp
          let endIp = value
          let getIp3 = (ip) => ip.split('.').slice(0, 3).join()

          if (!startIp) {
            callback(new Error('请输入开始地址'))
          } else if (!ipReg.test(startIp)) {
            callback(new Error('开始地址格式不正确'))
          } else if (getIp3(startIp) !== getIp3(endIp)) {
            callback(new Error('开始地址和结束地址不在同一地址段'))
          } else {
            let len = ip(endIp).sub(startIp)
            if (len < 0) {
              callback(new Error('结束地址不能小于开始地址'))
            } else {
              callback()
            }
          }
        },
        trigger: _TRIGGER_
      }
    ],
    change () {
      me.getForm().resetField('channelNum', 1)
    },
    show: () => show(!1, 'second'),
    createFunction: 'formItem'
  }
  let startChannelNum = {
    tag: 'el-input',
    name: 'startChannelNum',
    label: '起始通道号',
    default: 1,
    tip: '设备提供给本系统的开始通道号',
    rules: [
      reg.required,
      reg.int5
    ],
    show () {
      return me.model.protocol !== 'siphost' && me.model.useType === 'camera'
    },
    createFunction: 'formItem'
  }
  let channelNum = {
    tag: 'el-input',
    name: 'channelNum',
    label: '通道数',
    default: 1,
    tip: '设备需要提供给本系统使用的通道个数',
    rules: [
      reg.required,
      {
        validator (rule, value, callback) {
          if (me.tab === 'second') {
            let ipReg = reg.ip.pattern
            let startIp = me.model.startIp
            let endIp = me.model.endIp
            let getIp3 = (ip) => ip.split('.').slice(0, 3).join()

            if (!startIp) {
              callback(new Error('请输入开始地址'))
            } else if (!ipReg.test(startIp)) {
              callback(new Error('开始地址格式不正确'))
            } else if (!endIp) {
              callback(new Error('请输入结束地址'))
            } else if (!ipReg.test(endIp)) {
              callback(new Error('结束地址格式不正确'))
            } else if (getIp3(startIp) !== getIp3(endIp)) {
              callback(new Error('开始地址和结束地址不在同一地址段'))
            } else {
              let len = ip(endIp).sub(startIp)
              let num = ~~(100000 / (len + 1))

              if (len < 0) {
                callback(new Error('开始地址不能大于结束地址'))
              } else if (!isNumber(value) || value > num || value === '0') {
                callback(new Error(
                  tpl('一共{len}个IP地址，每次共允许创建100000个通道。请输入大于1，小于{num}的整数', {
                    len: Math.abs(len) + 1,
                    num
                  })
                ))
              } else {
                callback()
              }
            }
          } else {
            return reg.num10000.validator(rule, value, callback)
          }
        },
        trigger: _TRIGGER_
      }
    ],
    show: () => show(!1),
    createFunction: 'formItem'
  }
  
  if (formType === 'edit') {
    return [
      name, useType4edit, groupId, gbId, port,
      protocol4edit, username, password
    ]
  } else {
    return [
      groupId, useType, protocol, startIp, endIp,
      startGbId, gbIdStep, gbIdTimes, gbId,
      username, password, port, startChannelNum, channelNum
    ]
  }
}
