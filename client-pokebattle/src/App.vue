<template>
  <my-hearder></my-hearder>
  <!-- <header>
    <nav
      class="
        flex
        justify-between
        p-5
        bg-slate-100
        border-b border-slate-700
        dark:bg-night dark:text-white
      "
    >
      <router-link class="dark:hover:text-teal-500" to="/">Home</router-link>
      <router-link class="dark:hover:text-teal-500" to="/pokedex"
        >Pokedex</router-link
      >
      <router-link class="dark:hover:text-teal-500" to="/about"
        >About</router-link
      >
      <router-link
        class="dark:hover:text-teal-500"
        to="/account"
        v-if="isLoggedIn"
        >Account</router-link
      >
      <router-link class="dark:hover:text-teal-500" to="/login" v-else
        >Login</router-link
      >
    </nav>
  </header> -->
  <router-view />
  <my-footer></my-footer>
</template>

<script>
import MyFooter from "./components/MyFooter.vue";
import MyHearder from "./components/MyHearder.vue";
export default {
  components: { MyHearder, MyFooter },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  font-family: Nunito;
}
</style>
