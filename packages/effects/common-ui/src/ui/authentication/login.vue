<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { encrypt } from "./utils/rsaEncrypt";

import { computed, onMounted, reactive, ref } from 'vue';


defineOptions({
  name: 'AuthenticationLogin',
});

const emit = defineEmits<{
  submit: [Recordable<any>];
}>();



onMounted(() => {

});

const formData = reactive({
  username: "avatar",
  passwd: "123456",
});
const loading =ref(false);
const formRules = reactive({
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  passwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const handleSubmit =()=>{
  const params={
    username:formData.username,
    passwd: encrypt(formData.passwd),
  }
  emit('submit', params);
}

defineExpose({
  getFormApi: () => {

  },
});
</script>

<template>

  <div @keydown.enter.prevent="handleSubmit" class="login">
    <vxe-form
      ref="ruleFormRef"
      class="login-form"
      :model="formData"
      :rules="formRules"
      :vertical="true"
      size="mini"
    >
      <vxe-form-item title="账号" field="username"  :span="24">
        <vxe-input
            v-model="formData.username"
            clearable
            placeholder="账号"
        />
      </vxe-form-item>


        <vxe-form-item  title="密码" field="passwd" :span="24">
          <vxe-input
            v-model="formData.passwd"
            clearable
           type="password"
            placeholder="密码"
          />
        </vxe-form-item>

        <vxe-form-item :span="24">
         <vxe-button
          status="primary"
          content="登录"
          style="width: 100%"
          :loading="loading"
          @click="handleSubmit()"
        />
        </vxe-form-item>


    </vxe-form>
  </div>
</template>

<style lang="scss" scoped>

.login {
  width: 100vw;
  height: 240px;
  display: flex;
  margin: 50% 30%;

  .login-form{
    border-radius: 10px;
    padding: 20px;
    border: 2px solid #ccc;
  }
}




</style>
