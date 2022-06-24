<template>
  <p>Hello world</p>
  <button @click="logout" class="border roundred px-2 py-1 bg-slate-300">
    XD
  </button>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("account");
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>

<style>
</style>