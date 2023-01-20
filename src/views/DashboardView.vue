<script setup>
   import { useLoginStore } from '@/stores/login';
   const login = useLoginStore();
</script>

<template>
   <div :class="`dashboard ${login.loginClass}`">
      <h1 class="loud-voice">This is the dashboard</h1>
      <div class="logged-in-message">This message is only for logged in users.</div>
      <div class="logged-out-message">This message is only for logged out users.</div>
      <div class="everyone-message">This message is for everyone.</div>
   </div>
</template>

<style>
   .logged-out .logged-in-message {
      display: none;
   }
   .logged-in .logged-out-message {
      display: none;
   }
   /*   .logged-out .logged-out-message {
      display: block;
   }
   .logged-in .logged-out-message {
      display: none;
   }
   .logged-in .logged-in-message {
      display: block;
   }*/
</style>
