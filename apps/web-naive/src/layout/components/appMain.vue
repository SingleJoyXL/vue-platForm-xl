<script setup lang="ts">
import { useGlobal } from "@pureadmin/utils";
import {
  computed,
  defineComponent,
  h,
  nextTick,
  onMounted,
  ref,
  Transition
} from "vue";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { getPlatform } from "@/utils/menu";

const props = defineProps({
  fixedHeader: Boolean
});

const { $storage, $config } = useGlobal<GlobalPropertiesApi>();

const keepAlive = computed(() => {
  return $config?.KeepAlive;
});

const transitions = computed(() => {
  return route => {
    return route.meta.transition;
  };
});

const hideTabs = computed(() => {
  return $storage?.configure.hideTabs;
});

const menuType = ref("");

nextTick(async () => {
  menuType.value = await getPlatform();
});
onMounted(async () => {
  publicConfigName.value = await getPlatform();
});
const layout = computed(() => {
  return $storage?.layout.layout === "horizontal";
});

const getSectionStyle = computed(() => {
  return [
    hideTabs.value && layout
      ? `padding-top: ${menuType.value ? 120 : 60}px;`
      : "",
    !hideTabs.value && layout ? "padding-top: 85px;" : "",
    hideTabs.value && !layout.value ? "padding-top: 48px" : "",
    !hideTabs.value && !layout.value ? "padding-top: 85px;" : "",
    props.fixedHeader ? "" : "padding-top: 0;"
  ];
});
const publicConfigName = ref("");
const transitionMain = defineComponent({
  props: {
    route: {
      type: undefined,
      required: true
    }
  },
  render() {
    return h(
      Transition,
      {
        name:
          transitions.value(this.route) &&
          this.route.meta.transition.enterTransition
            ? "pure-classes-transition"
            : (transitions.value(this.route) &&
                this.route.meta.transition.name) ||
              "fade-transform",
        enterActiveClass:
          transitions.value(this.route) &&
          `animate__animated ${this.route.meta.transition.enterTransition}`,
        leaveActiveClass:
          transitions.value(this.route) &&
          `animate__animated ${this.route.meta.transition.leaveTransition}`,
        mode: "out-in",
        appear: true
      },
      {
        default: () => [this.$slots.default()]
      }
    );
  }
});
</script>

<template>
  <section
    id="mainSection"
    :class="{
      'app-main': props.fixedHeader,
      changdian: publicConfigName === 'changdian',
      'app-main-nofixed-header': !props.fixedHeader
    }"
    :style="getSectionStyle"
  >
    <router-view>
      <template #default="{ Component, route }">
        <keep-alive
          v-if="keepAlive && (route.meta?.keepAlive || route.meta?.backstage)"
        >
          <component :is="Component" :key="route.path" class="main-content" />
        </keep-alive>
      </template>
    </router-view>
  </section>
</template>

<style scoped>
.app-main {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  padding-top: 60px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #edece3;
  &.changdian {
    padding-top: 100px;
  }
}

.app-main-nofixed-header {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.main-content {
  margin: 20px 10px 0 10px;
}
</style>
