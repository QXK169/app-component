<template>
  <demo-block title="基础用法">
    <keyboard :length="7"  @close="close" @confirm="confirm" />
  </demo-block>
</template>

<script setup>
import keyboard from '../index.vue';


const close = () => {};
</script>
