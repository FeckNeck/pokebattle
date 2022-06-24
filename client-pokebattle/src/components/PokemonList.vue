<template>
  <div
    class="
      xl:px-24 xl:max-w-4xl
      lg:max-w-3xl
      md:max-w-2xl md:px-14
      sm:max-w-xl
      mx-auto
      px-4
      py-4
      w-full
      max-w-xs
    "
  >
    <div class="pb-7">
      <label class="flex flex-row items-center">
        <svg
          class="absolute pl-2 text-slate-400"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <input
          class="
            pl-7
            pr-1
            py-1
            border-2
            rounded
            focus:outline-none focus:border-slate-400
            w-52
            dark:bg-secondary-dark
            dark:border-ternary-dark
            dark:focus:border-slate-600
          "
          type="search"
          placeholder="Search"
          @input="searchFilter($event)"
        />
      </label>
    </div>
    <div class="py-4">
      <div
        class="
          grid
          sm:grid-cols-4
          lg:grid-cols-5
          grid-cols-2
          gap-6
          min-h-[750px]
        "
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="300"
      >
        <div
          v-for="(pokemon, index) in pokemons"
          :key="'poke' + index"
          :class="colorFromType(pokemon.Types[0])"
          class="
            p-4
            h-fit
            mx-auto
            shadow-login
            border
            rounded
            transition-all
            duration-300
            ease-in-out
            hover:cursor-pointer hover:-translate-y-1
            dark:bg-secondary-dark
            dark:border-x-ternary-dark
            dark:border-t-ternary-dark
            dark:shadow-ternary-dark
          "
          @click="
            this.$router.push({
              name: 'pokemonDetails',
              params: { id: pokemon.PokedexNumber },
            })
          "
        >
          <img
            class="transition-all pokemon-image max-w-[84px] max-h-[84px]"
            :src="pixelImageLink + pokemon.PokedexNumber + '.png'"
          />
          <p class="text-center">{{ pokemon.Name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      min: 0,
      max: 20,
      filterSearch: "",
      currentUrl: String,
      canScroll: true,
      pokemons: [],
      pixelImageLink:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/",
    };
  },
  props: {
    apiUrl: String,
  },
  created() {
    if (localStorage.getItem("scrollPosition") !== null) {
      this.max = parseInt(localStorage.getItem("scrollPosition"));
      this.fetchPokemons();
      localStorage.removeItem("scrollPosition");
    } else {
      this.fetchPokemons();
    }
    window.addEventListener("scroll", this.scrollTrigger);
  },
  // mounted() {
  //   localStorage
  // },
  methods: {
    fetchPokemons() {
      const currentUrl =
        this.apiUrl +
        "?min=" +
        this.min +
        "&max=" +
        this.max +
        "&name=" +
        this.filterSearch;
      fetch(currentUrl)
        .then((resp) => {
          if (resp.status === 200) {
            return resp.json();
          }
        })
        .then((data) => {
          data.data.forEach((pokemon) => {
            this.pokemons.push(pokemon);
          });
          this.max += 20;
          this.min = this.max - 20;
          this.canScroll = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    colorFromType: function (type) {
      let color;
      if (type == "normal" || type == "steel") {
        color = "border-b-2 border-b-slate-400";
      } else if (type == "grass" || type == "bug") {
        color = "border-b-2 border-b-lime-600";
      } else if (type == "fire") {
        color = "border-b-2 border-b-red-500";
      } else if (type == "water") {
        color = "border-b-2 border-b-blue-500";
      } else if (type == "electric" || type == "dragon") {
        color = "border-b-2 border-b-amber-300";
      } else if (type == "poison") {
        color = "border-b-2 border-b-violet-400";
      } else if (type == "dark" || type == "ghost") {
        color = "border-b-2 border-b-gray-800";
      } else if (type == "ice" || type == "flying") {
        color = "border-b-2 border-b-sky-300";
      } else if (type == "fighting" || type == "ground" || type == "rock") {
        color = "border-b-2 border-b-yellow-700";
      } else if (type == "fairy" || type == "psychic") {
        color = "border-b-2 border-b-pink-300";
      }
      return color;
    },
    scrollTrigger() {
      if (
        window.scrollY + 100 >=
          document.documentElement.scrollHeight -
            document.documentElement.clientHeight &&
        this.canScroll
      ) {
        // this.currentUrl = this.apiUrl + "?min=" + this.min + "&max=" + this.max;
        this.fetchPokemons();
        this.canScroll = false;
        localStorage.setItem("scrollPosition", this.max);
      }
    },
    searchFilter(event) {
      this.pokemons = [];
      this.min = 0;
      this.max = 20;
      this.filterSearch = event.srcElement.value.toLowerCase().trim();
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.fetchPokemons());
        }, 500);
      });
    },
  },
};
</script>

<style>
.pokemon-image {
  image-rendering: pixelated;
}
</style>