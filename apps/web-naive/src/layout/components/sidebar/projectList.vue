<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useNav } from "@/layout/hooks/useNav";
import { listAll } from "@/api/base";
import ArrowLeft from "@iconify-icons/ep/arrow-left-bold";
import ArrowRight from "@iconify-icons/ep/arrow-right-bold";
const { backTopMenu } = useNav();
onMounted(async () => {
  await listAll().then((res) => {
    const result = res.data["数据中台"].filter(
      (d) =>
        d.subitemName !== "全景数据服务" && d.subitemName !== "设备对象构建",
    );
    curProjectList.value = result.sort((a, b) => a.sort - b.sort);
  });
  init();
});
const curProjectList = ref([]);
const currentName = ref("数据服务");
const clickItem = (item: any) => {
  if (item.subitemName === currentName.value) {
    backTopMenu();
  } else {
    handleCommand(item.link);
  }
};

const handleCommand = (command: string) => {
  window.open(`${window.origin}${command}`);
};

// 控制左右按钮的显示
const showLeftButton = ref<boolean>(false);
const showRightButton = ref<boolean>(true);
// 获取滚动容器的引用
const scrollContainer = ref<HTMLElement | null>(null);
// 设置每次滚动的宽度
const scrollStep = 220;
// 向左滚动
const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      left: scrollContainer.value.scrollLeft - scrollStep,
      behavior: "smooth", // 平滑滚动
    });
  }
};

// 向右滚动
const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      left: scrollContainer.value.scrollLeft + scrollStep,
      behavior: "smooth", // 平滑滚动
    });
  }
};
// 监听滚动，控制按钮的显示与隐藏
const handleScroll = () => {
  if (scrollContainer.value) {
    const container = scrollContainer.value;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const containerWidth = container.clientWidth;
    // 判断是否已经滚动到最开始
    showLeftButton.value = scrollLeft > 0;
    // 判断是否已经滚动到最末尾
    showRightButton.value = scrollLeft < scrollWidth - containerWidth;
  }
};
// 初始化时设置按钮状态
const init = () => {
  if (scrollContainer.value) {
    handleScroll();
  }
};
</script>

<template>
  <div
    class="project-list"
    style="height: 100%; position: relative; display: flex; align-items: center"
  >
    <!-- 左侧按钮，只有在非最左端时显示 -->
    <el-icon
      class="scroll-button left"
      :class="{ hidden: !showLeftButton }"
      @click="scrollLeft"
    >
      <ArrowLeft />
    </el-icon>
    <div ref="scrollContainer" class="scroll-container" @scroll="handleScroll">
      <span
        v-for="(item, index) in curProjectList"
        :key="index"
        :class="[
          'project-list-item',
          { 'nav-title': currentName === item.subitemName },
        ]"
        @click="clickItem(item)"
      >
        {{ item.subitemName }}
      </span>
    </div>
    <!-- 右侧按钮，只有在非最右端时显示 -->
    <el-icon
      class="scroll-button right"
      :class="{ hidden: !showRightButton }"
      @click="scrollRight"
    >
      <ArrowRight />
    </el-icon>
  </div>
</template>

<style lang="scss" scoped>
.project-list {
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%; /* 父容器宽度自适应 */
  overflow: hidden; /* 隐藏滚动条 */
}
.project-list-item {
  margin: 0 10px;
  color: #fff;
  font-family: MicrosoftYaHei;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 2px;
  font-size: 16px;
  cursor: pointer;
  text-shadow: 2px 2px 5px #000;
  display: inline-block;
}
.nav-title {
  letter-spacing: 2px;
  font-size: 20px;
  font-family: MicrosoftYaHei;
  font-weight: normal;
  font-stretch: normal;
  color: #fff;
  position: relative;
  cursor: pointer;
  &::before {
    display: block;
    content: "";
    width: 100%;
    height: 2px;
    background-color: #76caff;
    position: absolute;
    bottom: -2px;
  }
}
.nav-title:not(:first-child) {
  margin-left: 15px;
  margin-right: 5px;
}
/* 横向滚动容器 */
.scroll-container {
  width: 100%; /* 宽度自适应 */
  height: 100%;
  // width: 900px; /* 横向容器的固定宽度 */
  // width: 1100px; /* 横向容器的固定宽度 */
  overflow-x: auto; /* 启用横向滚动 */
  white-space: nowrap; /* 防止换行 */
  position: relative;
  /* 隐藏横向滚动条 */
  -ms-overflow-style: none; /* 对于 Internet Explorer 10+ */
  scrollbar-width: none; /* 对于 Firefox */
  display: flex;
  align-items: center;
}
.scroll-button {
  color: #000;
  background: #fff;
  width: 16px;
  height: 16px;
  border-radius: 8px;
}
/* 隐藏按钮时，保持占位不改变布局 */
.hidden {
  opacity: 0; /* 隐藏按钮 */
  pointer-events: none; /* 禁用点击事件 */
}
</style>
