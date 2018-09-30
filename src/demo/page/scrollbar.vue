<template>
  <div class="keyboard">
    <div class="reference"></div>
    <div class="context">
      <div class="ellipse"
           :class="`b${key}`"
           @click="click(value)"
           v-for="(value, key) in keys">
        <span class="arrow"></span>
      </div>
      <div class="center"></div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      keys: {
        0: '0',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7'
      }
    }
  },
  methods: {
    click (v) {
      console.log('click' + v)
    }
  },
  mounted () {

  }
}
</script>
<style lang="less">
  .util-content {
    position: absolute;
    display: block;
    content: '';
  }

  .keyboard {
    margin-left: 300px;
    width: 201px;
    height: 201px;

    .reference {
      &:extend(.util-content);

      width: 800px;
      height: 1px;
      background-color: #000;
      top: 121px;
      left: 200px;

      &:after {
        &:extend(.util-content);
        width: 1px;
        height: 600px;
        background-color: #000;
        top: -121px;
        left: 221px;
      }
    }

    .context,
    .center {
      width: 100%;
      height: 100%;
      border-radius: 100%;
      background-color: #555;
      overflow: hidden;
    }

    .context {
      position: relative;
    }

    .center {
      position: absolute;
      top: 40px;
      left: 40px;
      width: 120px;
      height: 120px;
      background-color: #333;
      z-index: 9000;
    }

    .b0 {
      top: -3px;
      left: 81px;
    }

    .b1 {
      top: 20px;
      left: 136px;
      transform: rotate(45deg);
    }

    .b2 {
      top: 75px;
      left: 158px;
      transform: rotate(90deg);
    }

    .b3 {
      top: 130px;
      left: 136px;
      transform: rotate(135deg);
    }

    .b4 {
      top: 153px;
      left: 81px;
      transform: rotate(180deg);
    }
    .b5 {
      top: 130px;
      left: 26px;
      transform: rotate(225deg);
    }
    .b6 {
      top: 75px;
      left: 1px;
      transform: rotate(270deg);
    }
    .b7 {
      top: 20px;
      left: 25px;
      transform: rotate(315deg);
    }

    .arrow {
      position: relative;
      display: block;
      width: 0;
      margin: 4px auto;
      border: 10px solid transparent;
      border-bottom: 18px solid #c1c1c1;
      z-index: 1000;
    }

    .ellipse {
      position: absolute;
      width: 40px;
      height: 50px;

      &:hover {
        cursor: pointer;
        background-color: #333;

        > .arrow{
          border-bottom-color: #fff;
        }

        &:after {
          background-color: #333;
        }
        &:before {
          background-color: #333;
        }
      }

      &:after {
        &:extend(.util-content);
        width: 20px;
        height: 50px;
        top: 0;
        left: -8px;
        transform:rotate(-22.5deg);
      }
      &:before {
        &:extend(.util-content);
        width: 20px;
        height: 50px;
        top: 0;
        left: 29px;
        transform:rotate(22.5deg);
      }
    }
  }
</style>
