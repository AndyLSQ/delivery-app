<script setup>
   import { useLoginStore } from '@/stores/login';
   import LoginForm from '@/components/LoginForm.vue';
   const login = useLoginStore();
</script>

<template>
   <div :class="`home ${login.loginClass}`">
      <h1 class="loud-voice">This is the landing page</h1>
      <div class="logged-in-message">This message is only for logged in users.</div>
      <div class="logged-out-message">This message is only for logged out users.</div>
      <div class="everyone-message">This message is for everyone.</div>
   </div>

   <LoginForm />
</template>

<style>
   .logged-out .logged-in-message {
      display: none;
   }
   .logged-in .logged-out-message {
      display: none;
   }
</style>
