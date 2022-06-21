<template>
  <form class="flex justify-center items-center flex-grow">
    <div class="p-5 bg-white rounded w-fit shadow-login">
      <p class="text-center" v-if="mode == 'login'">Login</p>
      <p class="text-center" v-else>Register</p>
      <p class="pt-2 text-center" v-if="mode == 'login'">
        You don't have an account ?
        <span
          class="underline text-blue-500 cursor-pointer"
          @click="switchToRegister()"
          >create one</span
        >
      </p>
      <p class="pt-2 text-center" v-else>
        You already have an account ?
        <span
          class="underline text-blue-500 cursor-pointer"
          @click="switchToLogin()"
          >Loggin</span
        >
      </p>
      <div class="relative my-4 border-2 focus-within:border-blue-500">
        <input
          v-model="email"
          id="email"
          type="email"
          placeholder=" "
          class="
            block
            w-full
            appearance-none
            focus:outline-none
            bg-transparent
            p-2
            text-sm
          "
        />
        <label
          for="email"
          class="absolute top-0 origin-0 duration-300 p-2 bg-white ml-2 text-sm"
          >Email</label
        >
      </div>
      <div class="flex flex-row my-4" v-if="mode == 'register'">
        <div class="relative border-2 focus-within:border-blue-500 mr-4">
          <input
            v-model="firstName"
            id="firstName"
            type="text"
            placeholder=" "
            class="
              block
              appearance-none
              focus:outline-none
              bg-transparent
              p-2
              text-sm
            "
          />
          <label
            for="firstName"
            class="
              absolute
              top-0
              origin-0
              duration-300
              p-2
              bg-white
              ml-2
              text-sm
            "
            >First name</label
          >
        </div>
        <div class="relative border-2 focus-within:border-blue-500">
          <input
            v-model="lastName"
            id="lastName"
            type="text"
            placeholder=" "
            class="
              block
              appearance-none
              focus:outline-none
              bg-transparent
              p-2
              text-sm
            "
          />
          <label
            for="lastName"
            class="
              absolute
              top-0
              origin-0
              duration-300
              p-2
              bg-white
              ml-2
              text-sm
            "
            >Last name</label
          >
        </div>
      </div>
      <div class="relative my-4 border-2 focus-within:border-blue-500">
        <input
          v-model="password"
          id="password"
          type="password"
          placeholder=" "
          class="
            block
            w-full
            appearance-none
            focus:outline-none
            bg-transparent
            p-2
            text-sm
          "
          pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$"
        />
        <label
          for="password"
          class="absolute top-0 origin-0 duration-300 p-2 bg-white ml-2 text-sm"
          >Password</label
        >
      </div>
      <button
        v-if="mode == 'login'"
        class="bg-gray-400 p-2 rounded text-white w-full"
        :class="{ 'bg-blue-500': validedFields }"
        @click="login()"
      >
        Login
      </button>
      <button
        v-else
        class="bg-gray-400 p-2 rounded text-white w-full"
        :class="{ 'bg-blue-500': validedFields }"
        @click="createAccount()"
      >
        Register
      </button>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      mode: "login",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      displayMessage: false,
    };
  },
  mounted() {
    console.log(this.$route.params);
    if (this.$route.params.error == "refreshToken") {
      this.openToast("Token expired", "error");
    }
  },
  computed: {
    validedFields() {
      if (this.mode == "register") {
        if (
          this.email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g) &&
          this.password.match(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/g
          ) &&
          this.firstName != "" &&
          this.lastName != ""
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (
          this.email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g) &&
          this.password.match(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/g
          )
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  methods: {
    switchToRegister() {
      this.mode = "register";
      this.resetFields();
    },
    switchToLogin() {
      this.mode = "login";
      this.resetFields();
    },
    createAccount() {
      if (this.validedFields) {
        const self = this;
        this.$store
          .dispatch("createAccount", {
            email: this.email,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
          })
          .then(
            function () {
              self.openToast("Account created ! U most Login now", "success");
              self.resetFields();
              self.switchToLogin();
              self.displayMessage = true;
            },
            function (error) {
              console.log(error);
              if (error.response.status == 403) {
                self.openToast(error.response.data, "error");
              }
            }
          );
      }
    },
    login() {
      if (this.validedFields) {
        const self = this;
        console.log("xd");
        this.$store
          .dispatch("login", {
            email: this.email,
            password: this.password,
          })
          .then(
            function () {
              self.openToast("Successfully logged in", "success");
              self.$router.push("/account");
            },
            function (error) {
              console.log("error:", error);
              if (error.response.status == 403) {
                self.openToast("Invalid email or password", "error");
              }
            }
          );
      }
    },
    resetFields() {
      this.email = "";
      this.password = "";
      this.firstName = "";
      this.lastName = "";
    },
    openToast(message, type) {
      this.$toast.open({
        message: message,
        type: type,
        position: "bottom-right",
        duration: "3000",
      });
    },
    account() {
      this.$store.dispatch("account");
    },
  },
};
</script>

<style>
</style>