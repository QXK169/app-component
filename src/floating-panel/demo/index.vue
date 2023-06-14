<template>
  <demo-block>
    <demo-block title="是否拖拽跟随">
      <Switch v-model="isFollowScroll" />
    </demo-block>
    <demo-block title="是否拖拽跟随">
      <Button @click="jump">跳转中间位置</Button>
    </demo-block>
    <demo-block title="改变尺寸">
      <Button @click="changeSize">改变尺寸</Button>
    </demo-block>

    <gw-floating-panel
      :anchors="anchors"
      :is-follow-scroll="isFollowScroll"
      ref="panel"
      @height-change="onHeightChange"
    >
      <List
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div v-for="item in list" :key="item" class="list-item">{{ item }}</div>
      </List>
    </gw-floating-panel>
  </demo-block>
</template>

<script setup>
  import 'vant/lib/index.css'
  import GwFloatingPanel from '../index.ts';
  import { Switch, Button, List } from 'vant';
  import { ref } from 'vue';
  import VConsole from 'vconsole';
  // const anchors = [100, window.innerHeight * 0.4, window.innerHeight * 0.8];

  const vConsole = new VConsole();
  console.log(vConsole)

  const anchors = ref([
    window.innerHeight * 0.1,
    window.innerHeight * 0.6,
    window.innerHeight * 0.6,
  ]);
  const isFollowScroll = ref(false);
  const panel = ref();
  const list = ref([]);
  const loading = ref(false);
  const finished = ref(false);

  const onLoad = () => {
    // 异步更新数据
    // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    setTimeout(() => {
      for (let i = 0; i < 15; i++) {
        list.value.push(list.value.length + 1);
      }

      // 加载状态结束
      loading.value = false;

      // 数据全部加载完成
      if (list.value.length >= 60) {
        finished.value = true;
      }
    }, 1000);
  };

  const jump = () => {
    panel.value.setTop(window.innerHeight * 0.5, { immediate: true });
  };
  const onHeightChange = (val) => {
    console.log(val);
  };
  const changeSize = () => {
    anchors.value = [window.innerHeight * 0.3, window.innerHeight * 0.6, window.innerHeight * 0.6];
  };
</script>
<style scoped>
  .list-item {
    padding: 30px;
    text-align: center;
  }
</style>
