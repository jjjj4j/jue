import { isArray, isBoolean, isChar, isUndefined } from './core'
import { fire } from '@/util/core'

export function each (obj, callback) {
  let length, i = 0
  
  if (isArray(obj)) {
    length = obj.length
    for (; i < length; i++) {
      if (callback.call(obj[i], obj[i], i) === false) {
        break
      }
    }
  } else {
    for (i in obj) {
      if (callback.call(obj[i], obj[i], i) === false) {
        break
      }
    }
  }
  
  return obj
}

export function map (elems, callback, arg) {
  let length, value, i = 0, ret = []
  
  if (isArray(elems)) {
    length = elems.length
    for (; i < length; i++) {
      value = callback(elems[i], i, arg)
      
      if (value != null) {
        ret.push(value)
      }
    }
  } else {
    for (i in elems) {
      value = callback(elems[i], i, arg)
      
      if (value != null) {
        ret.push(value)
      }
    }
  }
  return [].concat(ret)
}

export function posterity (list, callback, recursive) {
  each(list, (node) => {
    fire(callback, node)
    if (recursive) {
      posterity(recursive(node), callback, recursive)
    }
  })
}

export function findInTree (tree, filter, result = [], attr = 'children') {
  let i, node
  let isFindFirst = isBoolean(result)

  if (isArray(tree)) {
    for (i = tree.length; i > 0;) {
      node = tree[--i]
      if (filter(node)) {
        if (isFindFirst) {
          return node
        }
        result.push(node)
      }
      node = findInTree(node[attr], filter, result, attr)
      if (isFindFirst && node) {
        return node
      }
    }
  }
  
  return isFindFirst ? undefined : result
}

export function array2tree (
  list,
  filter,
  id = 'id',
  pId = 'parentId',
  children = 'children',
  parent = 'parent'
) {
  let i = 0, l = list.length
  if (!list || l === 0) {
    return []
  }
  
  let tree = [], tmp = {}
  
  if (isChar(filter)) {
    parent = children
    children = pId
    pId = id
    id = filter
    filter = !1
  }
  
  if (filter) {
    for (i = 0; i < l; i++) {
      if (filter(list[i])) {
        tmp[list[i][id]] = list[i]
      }
    }
  } else {
    for (i = 0; i < l; i++) {
      tmp[list[i][id]] = list[i]
    }
  }
  
  for (i = 0; i < l; i++) {
    if (tmp[list[i][id]]) {
      if (tmp[list[i][pId]]) {
        if (list[i][id] === list[i][pId]) {
          throw new Error(`error --> ID: ${id}, id === pId`)
        } else {
          if (!tmp[list[i][pId]][children]) {
            tmp[list[i][pId]][children] = []
          }
          tmp[list[i][pId]][children].push(list[i])
          list[i][parent] = tmp[list[i][pId]]
        }
      } else {
        tree.push(list[i])
      }
    }
  }
  return {
    list: tree,
    cache: tmp
  }
}

export function tree2array (
  tree,
  list = [],
  extAttr,
  children = 'children',
  parent = 'parent'
) {
  each(tree, (node) => {
    list.push(node)
    tree2array(node[children], list)
    if (isArray(extAttr)) {
      each(extAttr, (attr) => {
        delete node[attr]
      })
    }
    delete node[children]
    delete node[parent]
  })
  return list
}

/**
 * @param array {Array}
 * @param items {Array}
 * @param start {Number}
 * @param delNum {Number}
 *
 * 1, 只有 `array` 将清空 `array`
 * 2, 只有 `array`, `items` ，清空 `array` 之后，将items的值插入 `array` 中
 * 3, 存在 `start`, `delNum`，将会从 `start` 开始删除 `delNum` 个对象，然后将 `items` 的值从
 *   `start` 插入 `array`
 * */
export function splice (array, items, start, delNum) {
  if (array && array !== items) {
    if (isUndefined(start)) {
      start = 0
      delNum = array.length
    } else {
      delNum = delNum || 0
    }
    array.splice(start, delNum)
    
    if (items) {
      let step = 100000
      let length = items.length
      if (length > step) {
        let count = length / step + (length % step > 0 ? 1 : 0)
        for (let i = 0; i < count; i++) {
          splice(array, items.slice(i * step, (i + 1) * step), start + step * i)
        }
      } else {
        items.splice(0, 0, start, 0)
        items.splice.apply(array, items)
      }
    }
  }
  return array
}
