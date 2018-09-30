import { tpl } from '@/util/char'
import { isArray, isEmpty } from '@/util/core'

const _TRIGGER_ = 'change'
const _REG_FLAGS = 'm'
const _BLUR_ = 'blur'

const required = function (msg, trigger) {
  return {
    validator: function (rule, value, callback) {
      if (isArray(value)) {
        if (value.length === 0) {
          callback(new Error(msg || '此处为必填项'))
        } else {
          callback()
        }
      } else if (value === '' || value === undefined) {
        callback(new Error(msg || '此处为必填项'))
      } else {
        callback()
      }
    },
    required: !0,
    trigger: trigger || _TRIGGER_
  }
}

const pattern = function (reg, msg, trigger, flags) {
  return {
    pattern: typeof reg === 'string' ? new RegExp(reg, flags) : reg,
    message: msg || '输入格式不匹配',
    trigger: trigger || _TRIGGER_
  }
}

const str = function (min, max, msg, flags) {
  return pattern('^.{' + min + ',' + max + '}$', msg, _TRIGGER_, flags)
}

// 字符串数字 01 001 1001
const int = function (min, max, msg) {
  return pattern('^[0-9]{' + min + ',' + max + '}$', msg)
}

// 严格数字开头不能是0
const num = function (min, max, msg, trigger) {
  return {
    validator: function (rule, value, callback) {
      if (value === '') {
        callback()
      }
      value = value + ''
      let _value_ = parseInt(value)
      if (
        value.length === (_value_ + '').length &&
          min <= _value_ && _value_ <= max
      ) {
        callback()
      } else {
        callback(new Error(msg ||
            tpl('请输入{min}-{max}的数字', {
              min: min,
              max: max
            })
        )
        )
      }
    },
    trigger: trigger || _TRIGGER_
  }
}

const remote = function (data) {
  let { id, name, api, apiPrefix, msg, param } = data
  return {
    validator: function (rule, value, callback) {
      if (value === '') {
        callback()
      } else {
        param = param || {}
        param[name] = value
        if (id) {
          param.id = id
        }
        Service[api](param, apiPrefix).then((r) => {
          if (r.data.status) {
            callback(new Error(msg || r.data.message))
          } else {
            callback()
          }
        }, (r) => {
          callback(new Error(r.data.message))
        })
      }
    },
    trigger: _BLUR_
  }
}

const getStrMsgByLength = function (length) {
  return tpl('限制{size}位字符输入', {
    size: length
  })
}

const getIntMsgByLength = function (length) {
  return tpl('仅支持数字输入，限制最大输入{size}位字符，最小为1位字符', {
    size: length
  })
}

let int20Reg = /^[0-9]{20}$/
let ipReg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/

const ip4gb = {
  validator: function (rule, value, callback) {
    if (value === '') {
      callback()
    }
    if (int20Reg.test(value)) {
      callback()
    } else {
      if (ipReg.test(value)) {
        callback()
      } else {
        callback(new Error('IP地址格式不正确'))
      }
    }
  },
  trigger: _TRIGGER_
}

const str16 = str(1, 16, getStrMsgByLength(16))
const str18 = str(1, 18, getStrMsgByLength(18))
const str20 = str(1, 20, getStrMsgByLength(20))
const str24 = str(1, 24, getStrMsgByLength(24))
const str25 = str(1, 25, getStrMsgByLength(25))
const str32 = str(1, 32, getStrMsgByLength(32))
const str36 = str(1, 36, getStrMsgByLength(36))
const str40 = str(1, 40, getStrMsgByLength(40))
const str45 = str(1, 45, getStrMsgByLength(45))
const str50 = str(1, 50, getStrMsgByLength(50))
const str64 = str(1, 64, getStrMsgByLength(64))
const str80 = str(1, 80, getStrMsgByLength(80))
const str100 = str(1, 100, getStrMsgByLength(100))
const str128 = str(1, 128, getStrMsgByLength(128), _REG_FLAGS)
const str150 = str(1, 150, getStrMsgByLength(150))
const str250 = str(1, 250, getStrMsgByLength(250))
const str1000 = str(1, 1000, getStrMsgByLength(1000))

const str1500 = str(1, 1500, getStrMsgByLength(1500))
const strDefault = str(1, 45, getStrMsgByLength(45))

const int5 = int(1, 5, getIntMsgByLength(5))
const int6 = int(1, 6, getIntMsgByLength(6))
const int10 = int(1, 10, getIntMsgByLength(10))
const int11 = int(1, 11, getIntMsgByLength(11))
const int18 = int(1, 18, getIntMsgByLength(18))
const int20 = int(1, 20, getIntMsgByLength(20))
const int24 = int(1, 24, getIntMsgByLength(24))
const int25 = int(1, 25, getIntMsgByLength(25))
const int32 = int(1, 32, getIntMsgByLength(32))
const int36 = int(1, 36, getIntMsgByLength(36))
const int50 = int(1, 50, getIntMsgByLength(50))
const int64 = int(1, 64, getIntMsgByLength(64))

const num20 = num(5, 20)
const num99 = num(0, 99)
const num100 = num(0, 100)
const num128 = num(0, 128)
const num180 = num(0, 180)
const num512 = num(1, 512)
const num1000 = num(1, 1000)
const num3000 = num(1, 3000)
const num3600 = num(1, 3600)
const num10000 = num(1, 10000)

const isNum = { type: 'number', message: '必须为数字值' }

const ptzIdleTime = num(5, 60, '可输入5-60中的任何数字')

const projectNumber = pattern(
  '^(([1-9]{1}[0-9]{0,6}))$',
  '可输入1—9999999中的任何数字'
)

const nodeNumber = pattern(
  '^(([1-9]{1}[0-9]{0,5}))$',
  '可输入1—999999中的任何数字'
)

const email = pattern(
  /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  '邮箱格式不正确'
)

const level = pattern(
  '^(([1-9]{1}[0-9]{0,3})|10000|0)$',
  '可输入0—10000中的任何数字，0的级别最小，10000的级别最大'
)

const cloudPersize = pattern(
  '^(([1-9]\\d{0,4})|0)(\\.\\d{1,2})?$',
  '支持数字输入，支持小数点后2位，最大支持小数点前4位数字输入，最大9999G'
)

const password = pattern(
  '^.{6,30}$',
  '限制6到30位字符输入'
)

const gbId = pattern(/^[0-9]{1,50}$/, '请输入1~50位长度的数字')

const maxWay = num(0, 1000, '仅支持数字输入，默认为4，不输入数字则不做限制，最大可设1000路')

const phone = pattern(
  /^[0-9\\-]{1,20}$/,
  '电话号码格式不正确,例如 010-82325561, 支持20位输入'
)

const ip = pattern(ipReg, 'IP地址格式不正确')

const port = num(0, 65535, '端口号请输入0到65535的整数')

const chanNo = pattern(
  '^(([1-9]{1}[0-9]{0,4}))$|^[0-9]{20}$',
  '可输入1—99999中的任何数字，或20位的国标编号'
)

const extraChannelNo = pattern(
  '^(([1-9]{1}[0-9]{0,4}))$',
  '可输入1—99999中的任何数字'
)

const serviceSize = pattern(
  '^(([1-9]\\d{0,19})|0)(\\.\\d{1,2})?$',
  '支持20位数字，精确到小数点后俩位'
)

const gbIdStep = pattern(
  '^(([1-9]{1}[0-9]{0,2}))$|^1000$',
  '可输入1—1000中的任何数字'
)

const gbIdTimes = pattern(
  '^([1-9]{1}[0-9]{0,2})$|^([1-2]{1})([0-9]{0,3})$|^3000$',
  '可输入1—3000中的任何数字'
)

const longitude = pattern(
  '^-?(?:(?:180(?:\\.0{1,16})?)|(?:(?:(?:1[0-7]\\d)|(?:[1-9]?\\d))(?:\\.\\d{1,16})?))$',
  '经度范围：-180~180，精确到小数点后16位'
)

const latitude = pattern(
  '^-?(?:90(?:\\.0{1,16})?|(?:[1-8]?\\d(?:\\.\\d{1,16})?))$',
  '纬度范围：-90~90，精确到小数点后16位'
)

const presetPositions = pattern(
  '^(([1-9]{1}[0-9]{0,3}))$',
  '可输入1—9999中的任何数字'
)

const deviceInfoPrice = pattern(
  '^(([1-9]\\d{0,9})|0)(\\.\\d{1,2})?$',
  '支持10位数字，精确到小数点后俩位'
)

const vodInCount6 = pattern(
  '^([1-9]\\d{0,4})?$',
  '最大支持5位数字输入'
)

const platformNum = pattern(
  '^([1-9]\\d{0,7})?$',
  '最大支持8位数字输入'
)

const macAddr = pattern(
  '^([0-9a-fA-F]{2}[:-]){5}([0-9a-fA-F]{2})$',
  'MAC地址格式不正确,格式如: 00:A3:19:EF:E4:24'
)

const uri = pattern((() => {
  let allowLocal = true
  let allowEmptyProtocol = true
  let protocol = ('http, https, ftp').split(',').join('|').replace(/\s/g, '')
  return new RegExp(
    '^' +
      // protocol identifier
      '(?:(?:' + protocol + ')://)' +
      // allow empty protocol
      (allowEmptyProtocol ? '?' : '') +
      // user:pass authentication
      '(?:\\S+(?::\\S*)?@)?' +
      '(?:' +
      // IP address exclusion
      // private & local networks
      (allowLocal
        ? ''
        : ('(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
              '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
              '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})')) +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broadcast addresses
      // (first & last IP address of each class)
      '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
      '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
      '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
      '|' +
      // host name
      '(?:(?:[a-z\\u00a1-\\uffff0-9]-?)*[a-z\\u00a1-\\uffff0-9]+)' +
      // domain name
      '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-?)*[a-z\\u00a1-\\uffff0-9])*' +
      // TLD identifier
      '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
      // Allow intranet sites (no TLD) if `allowLocal` is true
      (allowLocal ? '?' : '') +
      ')' +
      // port number
      '(?::\\d{2,5})?' +
      // resource path
      '(?:/[^\\s]*)?' +
      '$', 'i'
  )
})())

const date = function (year, month, day, notInFuture) {
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return false
  }
  if (day.length > 2 || month.length > 2 || year.length > 4) {
    return false
  }

  day = parseInt(day, 10)
  month = parseInt(month, 10)
  year = parseInt(year, 10)

  if (year < 1000 || year > 9999 || month <= 0 || month > 12) {
    return false
  }
  let numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  // Update the number of days in Feb of leap year
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    numDays[1] = 29
  }

  // Check the day
  if (day <= 0 || day > numDays[month - 1]) {
    return false
  }

  if (notInFuture === true) {
    var currentDate = new Date(),
      currentYear = currentDate.getFullYear(),
      currentMonth = currentDate.getMonth(),
      currentDay = currentDate.getDate()
    return (year < currentYear || (year === currentYear && month - 1 < currentMonth) || (year === currentYear && month - 1 === currentMonth && day < currentDay))
  }

  return true
}

const id = {
  validator (rule, value, callback) {
    if (value === '') {
      callback()
    }

    let error = () => callback(new Error('身份证号填写错误, 请重新填写'))
    value = value.trim()
    if (!/^\d{15}$/.test(value) && !/^\d{17}[\dXx]{1}$/.test(value)) {
      error()
    }
    // Check date of birth
    let dob
    if (value.length === 18) {
      dob = value.substr(6, 8)
    } else /* length == 15 */ {
      dob = '19' + value.substr(6, 6)
    }
    let year = parseInt(dob.substr(0, 4), 10),
      month = parseInt(dob.substr(4, 2), 10),
      day = parseInt(dob.substr(6, 2), 10)
    if (!date(year, month, day)) {
      error()
    }

    // Check checksum (18-digit system only)
    if (value.length === 18) {
      let sum = 0,
        weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      for (var i = 0; i < 17; i++) {
        sum += parseInt(value.charAt(i), 10) * weight[i]
      }
      sum = (12 - (sum % 11)) % 11
      let checksum = (value.charAt(17)
        .toUpperCase() !== 'X') ? parseInt(value.charAt(17), 10) : 10
      if (checksum === sum) {
        callback()
      } else {
        error()
      }
    }

    callback()
  },
  trigger: _TRIGGER_
}
const name = function (min, max, msg, trigger) {
  msg = msg || `支持${min}~${max}位的中文、英文（大小写）、数字输入`
  return {
    validator: function (rule, value, callback) {
      if (isEmpty(value)) {
        callback()
      }
      let reg = new RegExp('^[\\u0391-\\uFFE5|a-z|A-Z|0-9]{' + min + ',' + max + '}$')
      if (!reg.test(value)) {
        callback(new Error(msg))
      }
      callback()
    },
    trigger: trigger || _TRIGGER_
  }
}

export default {
  required: required(),
  str16,
  str18,
  str20,
  str24,
  str25,
  str32,
  str36,
  str40,
  str45,
  str50,
  str64,
  str80,
  str100,
  str128,
  str150,
  str250,
  str1000,
  str1500,
  strDefault,
  int5,
  int6,
  int10,
  int11,
  int18,
  int20,
  int24,
  int25,
  int32,
  int36,
  int50,
  int64,
  num,
  num20,
  num99,
  num128,
  num100,
  num180,
  num512,
  num1000,
  num3000,
  num3600,
  num10000,
  name,
  level,
  gbId,
  chanNo,
  id,
  ip,
  ip4gb,
  port,
  email,
  maxWay,
  latitude,
  longitude,
  password,
  gbIdStep,
  gbIdTimes,
  serviceSize,
  cloudPersize,
  extraChannelNo,
  presetPositions,
  deviceInfoPrice,
  vodInCount6,
  trunkInCount6: vodInCount6,
  platformNum,
  isNum,
  macAddr,
  phone,
  uri,
  ptzIdleTime,
  projectNumber,
  nodeNumber,
  remote
}
