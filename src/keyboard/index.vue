<template>
    <div :class="['gwm-popup', !visible ? 'safe-area-inset-light' : 'safe-area-inset-dark']">
      <div class="gwm-popup-header van-hairline--bottom">
        <span>添加车牌号</span>
        <div class="icon-close" @click="close">
          <img src="./images/icon_close.png" alt="" />
        </div>
      </div>
      <div class="gwm-popup-body">
        <div class="gwm-car-container">
          <div class="gwm-car-input">
            <div v-for="(_, idx) in length" :key="idx" @click="handleLicense(idx)">
              <!-- 省份 -->
              <div
                v-if="idx === 0"
                :class="[
                  'gwm-car-input-item gwm-car-input-item-city',
                  carNolist.length > 0 || defaultCity ? 'gwm-car-input-item-lignt' : '',
                ]"
              >
                <span class="gwm-cat-title">{{ carNolist[idx] }}</span>
                <i class="gwm-car-input-item-cursor" v-if="carActive === idx"></i>
              </div>
              <!-- 新能源车牌 -->
              <div
                v-else-if="idx === length - 1"
                :class="[
                  'gwm-car-input-item',
                  carActive < length - 1 ? 'gwm-car-input-item-focus' : '',
                ]"
              >
                <span class="gwm-cat-title">{{ carNolist[idx] }}</span>
                <span class="gwm-car-new" v-if="!carNolist[idx] && carActive < length - 1"
                  >新能源</span
                >
                <i class="gwm-car-input-item-cursor" v-if="carActive === idx"></i>
              </div>
              <!-- 普通 -->
              <div v-else class="gwm-car-input-item">
                <span class="gwm-cat-title">{{ carNolist[idx] }}</span>
                <i class="gwm-car-input-item-cursor" v-if="carActive === idx"></i>
              </div>
            </div>
          </div>

          <div class="gwm-car-tags" v-if="licenseList.length">
            <div
              class="gwm-car-tag"
              @click="handleTag(item)"
              v-for="(item, idx) in licenseList"
              :key="idx"
            >
              {{ item }}
            </div>
          </div>
          <div class="gwm-btn-container">
            <div :class="['gwm-btn', isPass ? 'gwm-btn-active' : '']" @click="ok"> 确认添加 </div>
          </div>
        </div>
        <div class="gwm-keyboard" v-if="visible">
          <div
            class="gwm-keyboard-tooltip"
            @click="
              (e) => {
                e.stopPropagation();
              }
            "
          >
            <span @click="hideKeyboard">收起</span>
          </div>
          <div
            :class="[
              'gwm-keyboard-items',
              keyboardType === 'en' && index !== 0 ? 'gwm-keyboard-en' : '',
            ]"
            v-for="(item, index) in list"
            :key="index"
          >
            <div
              :class="[
                'gwm-keyboard-item',
                keyboardActive === index + '-' + key ? 'gwm-keyboard-item-active' : '',
                subItem.disabled ? 'gwm-keyboard-item-disabled' : '',
              ]"
              @touchstart.passive="onTouchStart(index, key, subItem)"
              @touchend.passive="onTouchEnd"
              v-for="(subItem, key) in item"
              :key="key"
              @click="handleClick(subItem)"
            >
              {{ subItem.text }}
            </div>
            <div
              v-if="index === 3"
              class="gwm-keyboard-item gwm-keyboard-right"
              @click="deleteCard"
            >
              <img src="./images/icon_del.png" alt="" class="icon-del" />
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    ref,
    computed,
    watchEffect,
    onUnmounted,
    onDeactivated,
  } from 'vue';
  import { areaOptions, engKeyBoardOptions } from './config';

  export default defineComponent({
    name: 'Keyboard',
    props: {
      length: {
        type: Number,
        default: 8,
      },
      licenseList: {
        type: Array,
        default: () => [],
      },
      city: {
        type: String,
        default: '京',
      },
      defaultLicense: {
        type: String,
        default: '',
      },
      show: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['confirm', 'close'],
    setup(props, { emit }) {
      const carNolist = ref(Array(props.length).fill('')); // 键盘选中
      const visible = ref(true); // 键盘隐藏
      const keyboardActive = ref<string>(''); // 点击选中
      const defaultCity = ref(props.city); // 默认城市
      const carActive = ref(0); // 车牌默认选中
      const isInit = ref(false);

      const provinceList = computed(() => {
        const tmp: any = [];
        // 切割成二维数组
        tmp[0] = areaOptions.slice(0, 10);
        tmp[1] = areaOptions.slice(10, 20);
        tmp[2] = areaOptions.slice(20, 30);
        tmp[3] = areaOptions.slice(30, 36);
        return tmp;
      });

      const letterList = computed(() => {
        const tmp: any = [];
        // 切割成二维数组
        tmp[0] = engKeyBoardOptions.slice(0, 10);
        tmp[1] = engKeyBoardOptions.slice(10, 19);
        tmp[2] = engKeyBoardOptions.slice(19, 28);
        tmp[3] = engKeyBoardOptions.slice(28, 36);
        return tmp;
      });

      const keyboardType = computed(() => (carActive.value === 0 ? 'cn' : 'en'));

      const list: any = computed(() => {
        // 处理键盘置灰
        let tempData: any = [];

        if (keyboardType.value === 'cn') {
          tempData = provinceList.value;
        } else {
          tempData = letterList.value;
          // 数字不可选
          if (carActive.value === 1) {
            tempData = tempData.map((item) =>
              item.map((sub) => {
                if (typeof sub.text === 'number') {
                  sub.disabled = true;
                }
                if (sub.text === 'O') {
                  sub.disabled = false;
                }
                return sub;
              }),
            );
          } else {
            tempData = tempData.map((item) =>
              item.map((sub) => {
                if (typeof sub.text === 'number') {
                  sub.disabled = false;
                }
                if (sub.text === 'O') {
                  sub.disabled = true;
                }
                return sub;
              }),
            );
          }
        }
        return tempData;
      });

      const isNull = (value) => value !== '';

      const isPass = computed(() => {
        let flag = true;
        carNolist.value.forEach((value, idx) => {
          if (!isNull(value) && idx < carNolist.value.length - 1) {
            flag = false;
          }
        });
        return flag;
      });



      watchEffect(() => {
        if (props.city && !isInit.value) {
          carNolist.value[0] = props.city;
          list.value.forEach((item, idx) => {
            item.forEach((sub, subIdx) => {
              if (sub.text === props.city) {
                keyboardActive.value = `${idx}-${subIdx}`;
              }
            });
          });
          isInit.value = true;
        }

        if (props.defaultLicense && props.show) {
          // eslint-disable-next-line no-use-before-define
          handleTag(props.defaultLicense);
        }
      });

      const handleTag = (item) => {
        // 点击标题
        const temArr = item.split('');
        temArr.forEach((element, idx) => {
          carNolist.value[idx] = element;
        });
        carActive.value = temArr.length;
        keyboardActive.value = '';
      };

      // 选中车牌
      const handleLicense = (idx) => {
        visible.value = true;
        carActive.value = idx;
        if (!idx) {
          keyboardActive.value = '';
        }
      };

      const onTouchStart = (index, subIdx, subItem) => {
        if (subItem.disabled) {
          return;
        }
        keyboardActive.value = `${index}-${subIdx}`;
      };
      const onTouchEnd = () => {
        keyboardActive.value = '';
      };

      const hideKeyboard = (event) => {
        event.preventDefault();
        event.stopPropagation();
        visible.value = false;
      };

      // 添加车牌
      const handleClick = (item) => {
        if (item.disabled) {
          return;
        }
        if (carActive.value === props.length) {
          return;
        }

        carNolist.value.splice(carActive.value, 1, item.text);

        if (carActive.value < props.length) {
          carActive.value++;
        }
      };

      // 删除车牌号
      const deleteCard = () => {
        if (carActive.value < 0) {
          return;
        }
        keyboardActive.value = '';
        if (!carNolist.value[carActive.value]) {
          if (carActive.value > 0) {
            carActive.value--;
          }
        }

        carNolist.value.splice(carActive.value, 1, '');
      };

      // 重置
      const reset = () => {
        carNolist.value = Array(props.length).fill('');
        carActive.value = 0;
        isInit.value = false;
      };

      const close = () => {
        reset();
        emit('close');
      };
      const ok = () => {
        if (!isPass.value) {
          return;
        }
        emit('confirm', carNolist.value.join(''));
        reset();
      };

      onUnmounted(() => {
        visible.value = true;
      });

      onDeactivated(() => {
        visible.value = true;
      });

      return {
        defaultCity,
        visible,
        list,
        keyboardType,
        carNolist,
        isPass,
        keyboardActive,
        carActive,
        handleTag,
        handleClick,
        deleteCard,
        close,
        ok,
        onTouchStart,
        onTouchEnd,
        hideKeyboard,
        handleLicense,
      };
    },
  });
</script>
<style lang="less" scoped>
  @width: 35px;
  @height: 44px;
  :deep(.van-popup--bottom.van-popup--round) {
    border-radius: 8px 8px 0px 0px;
  }
  .gwm-popup {
    user-select: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    &-header {
      background-color: #fff;
      padding: 16px 20px;
      text-align: center;
      color: #30363c;
      font-size: 16px;
      border-radius: 8px 8px 0px 0px;
      position: relative;
      .icon-close {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 25px;
          height: 25px;
        }
      }
    }
    &-body {
      width: 100%;
      background-color: #fff;
      .gwm-car-container {
        padding: 32px 20px 0;
        background-color: #fff;
        .gwm-car-input {
          display: flex;
          margin-right: -8px;
          &-item {
            width: @width;
            height: @height;
            margin-right: 8px;
            background: #f7f8f9;
            border-radius: 4px;
            border: 1px solid #c4c4c4;
            position: relative;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            &-focus {
              border: 1px dashed #c4c4c4;
            }
            &-cursor {
              display: inline-block;
              position: absolute;
              width: 19px;
              height: 2px;
              background: #5ec7d1;
              border-radius: 1px;
              bottom: 4px;
              left: 50%;
              transform: translateX(-50%);
              animation: gwm-cursor-flicker 1s infinite;
              &-light {
                background: #fff;
              }
            }
            &-city {
              border-color: #5ec7d1;
              background: #5ec7d1;
              color: #fff;
            }
            &-lignt {
              i {
                background: #fff;
              }
            }
          }
          .gwm-car-new {
            color: #c4c4c4;
            writing-mode: vertical-lr;
            font-size: 12px;
          }
        }
        .gwm-car-tags {
          display: flex;
          padding: 20px 0 12px;
          .gwm-car-tag {
            font-size: 12px;
            background: #f7f8f9;
            border-radius: 2px;
            color: #979899;
            padding: 1px 4px;
            margin-right: 10px;
          }
        }
        .gwm-btn-container {
          padding: 6px 0;
          margin-top: 20px;
          .gwm-btn {
            width: 100%;
            height: 44px;
            line-height: 44px;
            color: #ffffff;
            font-size: 16px;
            background: #c4c4c4;
            border-radius: 4px;
            text-align: center;
          }
          .gwm-btn-active {
            background: #5ec7d1;
            color: #fff;
          }
        }
      }
      .gwm-keyboard {
        width: 100%;
        overflow: hidden;
        &-tooltip {
          padding: 10px;
          background: #f5f5f5;
          text-align: right;
          color: #30363c;
          font-size: 14px;
        }
        &-items {
          display: flex;
          padding: 0 10px;
          margin-right: -6px;
          background: #f5f5f5;
          .gwm-keyboard-item {
            display: inline-block;
            width: 30px;
            height: 44px;
            line-height: 44px;
            text-align: center;
            border-radius: 2px;
            background: #fff;
            position: relative;
            margin-bottom: 8px;
            margin-right: 6px;
            color: #30363c;
            font-size: 19px;
            position: relative;
            box-sizing: border-box;
          }
          .gwm-keyboard-item-active {
            border: 1px solid #5ec7d1;
            color: #5ec7d1;
            background: #ecf9f9;
          }
          .gwm-keyboard-item-disabled {
            color: #c4c4c4;
          }
          .gwm-keyboard-right {
            width: 66px;
            height: 44px;
            margin-left: auto;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            .icon-del {
              width: 26px;
              height: 18px;
            }
            &:hover {
              opacity: 0.8;
            }
          }
        }
        .gwm-keyboard-en {
          justify-content: center;
          .gwm-keyboard-right {
            margin-left: 0;
          }
        }
      }
    }
  }
  .safe-area-inset-light {
    padding-bottom: 20px;
    background-color: #ffff;
  }
  .safe-area-inset-dark {
    padding-bottom: 20px;
    background: #f5f5f5;
  }

  @keyframes gwm-cursor-flicker {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }
</style>
