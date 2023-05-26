<template>
  <demo-block title="自定义颜色">
    <floating-panel
      :anchors="anchors"
      :is-follow-scroll="isFollowScroll"
      ref="panel"
      @height-change="onHeightChange"
    >
      <div
        v-for="item in 20"
        :key="item"
        style="height: 50px; line-height: 50px; text-align: center"
        >{{ item }}</div
      >
    </floating-panel>
  </demo-block>
</template>

<script setup>
import FloatingPanel from '../FloatingPanel';
import { ref } from 'vue';

const anchors = ref([
  window.innerHeight * 0.1,
  window.innerHeight * 0.7,
  window.innerHeight * 0.9,
]);
const isFollowScroll = ref(false);
const panel = ref();

const onHeightChange = (val) => {
  console.log(val);
};
</script>
