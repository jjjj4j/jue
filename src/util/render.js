import { isArray, extend, isChar, isFunction, isPlainObject, isDefined } from './core'
import { map } from './array'

/**
 * @slot 相应的slot将会替换此元素，并进行渲染
 * @data.slot 如果组件是其他组件的子组件，需为插槽指定名称
 *
 * 用于vue模板的配置化生成
 * 以下是标签模板 用与构造formItem的item
 *
 *{
 * tag: 'el-input',
 * type: '当tag为el-input时使用',
 * data: {
 *   ref: '',
 *   key: '',
 *   class: {
 *     foo: true,
 *     bar: false
 *   },
 *   style: {
 *     color: 'red',
 *     fontSize: '14px'
 *   },
 *   attrs: {
 *     id: '',
 *     name: ''
 *   },
 *   props: {},
 *   domProps: {
 *     innerHTML: 'baz'
 *   },
 *   on: {
 *     click: function () {}
 *   },
 *   slot: 'name'
 * },
 * slot: 'name',
 * show: function(){},
 * change: function(){},
 * children: [],
 * createFunction: ''
 *}
 *
 * */
export function init ($$, $factory, item, customRender) {
  let createFunction = item.createFunction
  let renderFunction = customRender[createFunction] || tplFunction[createFunction]
  if (renderFunction) {
    return renderFunction.call(this, $$, $factory, item, customRender)
  } else {
    let slot = item.slot
    if (isDefined(slot)) {
      if (isChar(slot)) {
        return $factory.$slots[item.slot]
      }
      if (isFunction(slot)) {
        slot = slot()
      }
      if (isPlainObject(slot)) {
        return $factory.$scopedSlots[slot.name || 'default'](slot.data)
      }
    }
    
    let children = item.children || []
    if (isArray(children)) {
      children = map(children, (child) => {
        return (child.tag || child.slot) ? init.call(this, $$, $factory, child, customRender) : child
      })
    }
    return $$(item.tag, item.data, children)
  }
}

/**
 * 模板工厂函数
 * 会先检查自定义工厂函数(customRender),在没有找到匹配时，才会调用(tplFunction)
 * */
const tplFunction = {
  comp4form ($$, $factory, item, customRender) {
    let me = this
    let show = item.show || (() => true)
    let itemData = {
      style: {},
      props: {
        checked: item.label,
        label: item.label
      }
    }
    let childData = extend({}, item.data)
    
    if (!show.call(me)) {
      itemData.style.display = 'none'
    }
    
    itemData.class = {}
    item.class ? (itemData.class[item.class] = !0) : (itemData.class[item.class] = !1)
    
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
  },
  formItem ($$, $factory, item, customRender) {
    let me = this
    // 在 model 属性变更时，重新绑定观察者
    if (item.name && !(item.name in me.model)) {
      me.$set(me.model, item.name, item.default || '')
    }
    let show = item.show || (() => true),
      props = {
        value: me.model[item.name]
      },
      event = {
        input (value) {
          me.model[item.name] = value
        }
      },
      itemData = {
        style: {},
        props: {
          rules: item.rules,
          label: item.label,
          prop: item.name
        }
      },
      childData = extend(true, {
        props: props,
        on: event
      }, item.data)
    
    if (item.name) {
      itemData.class = {}
      itemData.class['form-item-' + item.name] = !0
    }
    
    if (!show.call(me)) {
      itemData.style.display = 'none'
    }
    
    if (item.change) {
      event.change = (value) => {
        item.change.call(me, value)
      }
    }
    
    if (item.desc) {
      props.placeholder = item.desc
    }
    
    if (['el-input', 'el-date-picker'].indexOf(item.tag) >= 0) {
      props.type = item.type || 'text'
      props.rows = 6
    } else if (item.tag === 'el-switch') {
      props['on-text'] = props['off-text'] = ''
    } else if (item.tag === 'el-select') {
      props['filterable'] = !0
      if (item.multiple) {
        props['multiple'] = !0
      }
    }
    
    // 兄弟节点
    item.siblings = item.siblings || []
    
    // 添加字段说明
    item.tips = []
    if (item.tip) {
      let text = item.tip
      let tip = {
        tag: 'span',
        data: {
          class: 'tip'
        }
      }
      if (isFunction(text)) {
        text = text()
      }
      if (isPlainObject(text)) {
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
      } else {
        tip.children = [text]
      }
      if (text) {
        item.tips.push(tip)
        itemData.class['has-tip'] = !0
      }
    }
    
    return init.call(me, $$, $factory, {
      tag: 'el-form-item',
      data: itemData,
      children: [
        {
          tag: item.tag,
          data: childData,
          children: item.children
        }
      ].concat(item.siblings, item.tips)
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
