import { fire, isArray, extend, isChar, isPlainObject, isDefined } from './core'
import { each, map } from './array'

const attr = function (item = {}, path, data) {
  if (isChar(path)) {
    path = path.split('.')
  }
  if (isArray(path)) {
    each(path, (key, index) => {
      if (index === path.length - 1) {
        item[key] = fire(data)
      } else {
        item = item[key] ? item[key] : (item[key] = {})
      }
    })
  }
  return item
}

/**
 * @param $$ Vue 的 createElement 函数
 * @param $factory 工厂渲染组件的 this 对象
 * @param data
 *  {
 *    tag: '', {String | Object | Function} 一个 HTML 标签字符串，组件选项对象，或者解析上述任何一种的一个 async 异步函数。必需参数。
 *    data:'', 一个包含模板相关属性的数据对象 （可参照 Vue '渲染函数 & JSX' 的文档）。可选参数。
 *    children:'' 子虚拟节点 (VNodes)，由 'createElement()' 构建而成，也可以使用字符串来生成“文本虚拟节点”。可选参数。
 *    show: '', 组件是否显示，默认显示， true 显示，false 不显示。 可选参数。
 *    exist: '', 组件是否存在，默认存在， true 存在，false 不存在。 可选参数。
 *    slot: '' 相应的slot将会替换此元素，并进行渲染, 与 data.slot 有区别。 可选参数。
 *  }
 * @param customRender 指定的渲染函数名称
 * @returns {*}
 */
export function init ($$, $factory, data = {}, customRender) {
  let {
    show, exist,
    slot, createFunction
  } = data
  
  exist = fire(exist)
  if (exist !== !1) {
    slot = fire(slot)
    if (isDefined(slot)) {
      if (isChar(slot)) {
        return $factory.$slots[slot]
      }
      if (isPlainObject(slot)) {
        return $factory.$scopedSlots[slot.name || 'default'](slot.data)
      }
    }
    
    show = fire(show)
    if (show === !1) {
      attr(data, 'style.display', 'none')
    }
    
    let renderFunction = customRender[createFunction] || tplFunction[createFunction]
    if (renderFunction) {
      return renderFunction.call(this, $$, $factory, data, customRender)
    } else {
      return tplFunction.default.call(this, $$, $factory, data, customRender)
    }
  }
}

/**
 * 模板工厂函数
 * 会先检查自定义工厂函数(customRender),在没有找到匹配时，才会调用(tplFunction)
 * */
const tplFunction = {
  default ($$, $factory, item, customRender) {
    let children = item.children || []
    if (isArray(children)) {
      children = map(children, (child) => {
        return (child.tag || child.slot) ? init.call(this, $$, $factory, child, customRender) : child
      })
    }
    return $$(item.tag, item.data, children)
  },
  formItem ($$, $factory, item, customRender) {
    let tips = []
    let { model } = this
    let { tag, name, type, label, rules, data, multiple, disabled, desc, change, siblings, children } = item
    
    // 在 model 属性变更时，重新绑定观察者
    if (name && !(name in model)) {
      this.$set(model, name, item.default || '')
    }
    
    let event = {
      input (value) {
        model[name] = value
      }
    }
    let props = { value: model[name] }
    let itemData = { props: { label, prop: name } }
    let childData = extend(true, { props, on: event }, data)
    
    if (tag === 'el-select') {
      props['multiple'] = !!multiple
    } else if (tag === 'el-switch') {
      props['on-text'] = props['off-text'] = ''
    } else if (['el-input', 'el-date-picker'].includes(tag)) {
      props.type = type || 'text'
      props.rows = 6
    }
  
    if (name) {
      attr(itemData, ['class', `form-item-${name}`], !0)
    }
    if (rules) {
      attr(itemData, ['props', 'rules'], rules)
    }
    if (disabled) {
      attr(childData, ['props', 'disabled'], !0)
    }
    if (change) {
      event.change = (value) => change.call(this, value)
    }
    if (desc) {
      props.placeholder = desc
    }
    
    // 兄弟节点
    siblings = siblings || []
    
    // 添加字段说明
    if (item.tip) {
      let text = item.tip
      let tip = {
        tag: 'span',
        data: {
          class: 'tip'
        }
      }
      text = fire(text)
      if (text) {
        if (isChar(text)) {
          tip.children = [text]
        } else if (isPlainObject(text)) {
          tip = text
        } else if (isArray(text)) {
          tip.children = map(text, (tip) => {
            return {
              tag: 'span',
              data: {
                class: 'tip-item'
              },
              children: [tip]
            }
          })
        }
        tips.push(tip)
        itemData.class['has-tip'] = !0
      }
    }

    return init.call(this, $$, $factory, {
      tag: 'el-form-item',
      data: itemData,
      children: [
        {
          tag,
          children,
          data: childData
        }
      ].concat(siblings, tips)
    }, customRender)
  },
  comp4form ($$, $factory, item, customRender) {
    let me = this
    let itemData = {
      style: {},
      class: {
        [item.class]: !!item.class
      },
      props: {
        label: item.label
      }
    }
    let childData = extend({}, item.data)
    
    return init.call(me, $$, $factory, {
      tag: 'el-form-item',
      data: itemData,
      children: [
        {
          tag: item.tag,
          data: childData,
          children: item.children
        }
      ]
    }, customRender)
  }
}

export function formFactoryRender (list, customRender, $$, $factory) {
  let slot = $factory.$slots.default
  return init.call(this, $$, $factory, {
    tag: 'el-form',
    data: {
      ref: 'form',
      props: {
        'model': this.model,
        'label-width': '120px'
      }
    },
    children: slot ? list.concat([slot]) : list
  }, customRender)
}

export function factoryRender (item, customRender, $$, $factory) {
  return init.call(this, $$, $factory, item, customRender)
}
