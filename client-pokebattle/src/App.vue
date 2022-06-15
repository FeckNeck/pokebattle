<template>
  <header>
    <nav class="flex justify-between p-5 bg-slate-100 border-b border-slate-700 dark:bg-night dark:text-white">
      <router-link class="dark:hover:text-teal-500" to="/">Home</router-link>
      <router-link class="dark:hover:text-teal-500" to="/pokedex">Pokedex</router-link>
      <router-link class="dark:hover:text-teal-500" to="/about">About</router-link>
      <router-link class="dark:hover:text-teal-500" to="/account" v-if="isLoggedIn">Account</router-link>
      <router-link class="dark:hover:text-teal-500" to="/login" v-else>Login</router-link>
    </nav>
  </header>
  <router-view class="dark:bg-night min-h-full"/>
  <footer class="flex justify-center border-t border-slate-700 mt-auto p-5 bg-slate-100 dark:bg-night dark:text-white dark:hover:text-teal-500">
    <p>Mathis Dousse</p>
  </footer>
</template>

<script>
  export default {
    computed : {
      isLoggedIn : function(){ 
        return this.$store.getters.isLoggedIn
      }
    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
      }
    },
  }
</script>

<style>
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html,body{
  height: 100%;
}

#app{
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

</style>
