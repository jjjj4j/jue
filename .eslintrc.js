module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    '$': true,
    'Service': true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'vue/no-unused-vars': 'off',
    'vue/require-v-for-key': 'off',
    'prefer-promise-reject-errors': 'off', // 要求使用 Error 对象作为 Promise 拒绝的原因
    'no-mixed-operators': 'off', // 禁止混合使用不同的操作符
    'no-trailing-spaces': 'off', // 禁用行尾空白
    'no-sequences': 'off', // 不允许使用逗号操作符
    'one-var': 'off', // 强制函数中的变量在一起声明或分开声明
    'no-new': 'off', // 禁止使用 new 以避免产生副作用
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
