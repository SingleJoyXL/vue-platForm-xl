<script lang="ts" setup>

import {AuthenticationLogin, SliderCaptcha, z} from '@vben/common-ui';

import {useUserStore} from '#/store/modules/user';

defineOptions({name: 'Login'});

</script>

<template>
  <AuthenticationLogin
    @submit="useUserStore().authLogin"
  />
</template>
