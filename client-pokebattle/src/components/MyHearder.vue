<template>
  <header>
    <nav
      class="
        px-3
        xl:px-24 xl:max-w-7xl
        lg:max-w-5xl lg:px-20
        md:max-w-5xl
        sm:max-w-2xl sm:px-8
        mx-auto
        shadow-lg
        sm:shadow-transparent
      "
    >
      <div class="sm:flex sm:justify-between sm:items-center py-4">
        <div class="flex justify-between items-center">
          <a href="/">
            <img src="../assets/logo-hugomrvt.png" class="h-6" alt="logo" />
          </a>
          <theme-switch-vue class="sm:hidden block"></theme-switch-vue>
          <button class="sm:hidden" type="button" @click="isOpen = !isOpen">
            <svg
              width="24"
              height="24"
              viewBox="0 0 21 16"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              v-if="!isOpen"
            >
              <line x1="1" y1="1" x2="20" y2="1"></line>
              <line x1="1" y1="8" x2="20" y2="8"></line>
              <line x1="1" y1="15" x2="20" y2="15"></line>
            </svg>
            <svg
              width="24"
              height="24"
              viewBox="0 0 21 16"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              v-else
            >
              <line x1="3" y1="1" x2="17" y2="15"></line>
              <line x1="17" y1="1" x2="3" y2="15"></line>
            </svg>
          </button>
        </div>
        <div
          class="block sm:flex sm:flex-row py-4"
          :class="isOpen ? 'block' : 'hidden'"
        >
          <router-link
            to="/pokedex"
            aria-label="pokedex"
            class="
              block
              sm:px-5 sm:py-0
              py-2
              text-lg
              hover:cursor-pointer hover:text-teal-400
              transition-colors
              duration-300
            "
            >Pokedex</router-link
          >
          <div>
            <router-link
              to="/account"
              aria-label="account"
              class="
                hover:text-teal-400
                transition-colors
                cursor-pointer
                duration-300
                block
                sm:hidden sm:px-5 sm:py-0
                py-2
              "
              v-if="isLoggedIn"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </router-link>
            <router-link
              to="/login"
              aria-label="login"
              class="text-lg dark:hover:text-teal-500 sm:hidden block"
              v-else
              >Login</router-link
            >
          </div>
        </div>
        <div class="flex flex-row">
          <router-link to="/account" alt="account" v-if="isLoggedIn">
            <svg
              class="
                hover:text-teal-400
                transition-colors
                cursor-pointer
                duration-300
                sm:block
                hidden
              "
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </router-link>
          <router-link
            to="/login"
            alt="login"
            class="dark:hover:text-teal-500 sm:block hidden"
            v-else
            >Login</router-link
          >
          <theme-switch-vue class="sm:block hidden px-4"></theme-switch-vue>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import ThemeSwitchVue from "./ThemeSwitch.vue";
export default {
  data() {
    return {
      isOpen: false,
    };
  },
  components: {
    ThemeSwitchVue,
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isLoggedIn;
    },
  },
  methods: {},
};
</script>

<style>
</style>