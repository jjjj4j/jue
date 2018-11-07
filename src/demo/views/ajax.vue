<template>
  <div class="ajax">Text: {{text}}</div>
</template>

<script>
import { chain } from '@/util/ajax'
import Timer from '@/util/Timer'

export default {
  data () {
    return {
      text: '0'
    }
  },
  mounted () {
    chain(
      [
        (rst) => new Promise((resolve, reject) => {
          Timer('3', () => {
            resolve(rst.push('3') && rst)
            this.text = rst.join()
          })
        }).then((rst) => {
          return rst
        }),
        (rst) => new Promise((resolve, reject) => {
          Timer('4', () => {
            resolve(rst.push('4') && rst)
            this.text = rst.join()
          })
        }),
        (rst) => new Promise((resolve, reject) => {
          Timer('5', () => {
            resolve(rst.push('5') && rst)
            this.text = rst.join()
          })
        })
      ],
      new Promise((resolve, reject) => {
        Timer('1', () => {
          resolve('1')
        })
      }),
      new Promise((resolve, reject) => {
        Timer('2', () => {
          resolve('2')
        })
      })
    ).then((rst) => {
      this.text = rst.join()
    })
  },
  destroyed () {
    Timer.destroy()
  }
}
</script>
