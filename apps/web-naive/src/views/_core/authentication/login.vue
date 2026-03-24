<script lang="ts" setup>

import {AuthenticationLogin, SliderCaptcha, z} from '@vben/common-ui';
import {$t} from '@vben/locales';

import {useAuthStore} from '#/store';

defineOptions({name: 'Login'});

const authStore = useAuthStore();



</script>

<template>
  <AuthenticationLogin
    :loading="authStore.loginLoading"
    @submit="authStore.authLogin"
  />
</template>
