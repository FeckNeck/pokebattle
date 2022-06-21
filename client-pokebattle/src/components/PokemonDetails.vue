<template>
  <div
    v-if="pokemon"
    class="
      xl:px-24 xl:max-w-7xl
      lg:max-w-5xl lg:px-20
      md:max-w-5xl
      sm:max-w-2xl sm:px-8
      mx-auto
      px-4
      flex
      grow
      items-center
      flex-row
      w-full
      sm:py-0
      py-4
    "
    data-aos="fade-right"
  >
    <div
      class="
        border
        shadow-login
        rounded
        w-full
        px-2
        py-1
        dark:bg-secondary-dark dark:border-ternary-dark dark:shadow-none
      "
    >
      <div>
        <p class="text-3xl">
          #{{ pokemon.PokedexNumber }} - {{ pokemon.Name }}
        </p>
      </div>
      <div class="md:flex justify-between items-center pt-4">
        <div class="px-7 w-64 mx-auto sm:m-0">
          <img
            class="
              w-full
              pokemon-image
              mx-auto
              object-contain
              max-w-96 max-h-[230px]
            "
            :src="animatedImage + pokemon.PokedexNumber + '.gif'"
          />
          <div class="flex justify-evenly py-3">
            <p
              class="py-1 px-2 bg-slate-100 rounded border"
              :class="colorFromType(pokemon.Types[0])"
            >
              {{ pokemon.Types[0].toUpperCase() }}
            </p>
            <p
              v-if="pokemon.Types[1]"
              class="py-1 px-2 bg-slate-100 rounded border"
              :class="colorFromType(pokemon.Types[1])"
            >
              {{ pokemon.Types[1].toUpperCase() }}
            </p>
          </div>
        </div>
        <div class="flex flex-col justify-between sm:py-0 py-8">
          <div class="flex justify-evenly text-center">
            <div class="">
              <p class="font-bold pb-2">Height</p>
              <p
                class="
                  px-10
                  py-1
                  rounded-full
                  bg-slate-100
                  dark:text-primary-dark
                "
              >
                {{ pokemon.HeightM }}m
              </p>
            </div>
            <div class="">
              <p class="font-bold pb-2">Weight</p>
              <p
                class="
                  px-10
                  py-1
                  rounded-full
                  bg-slate-100
                  dark:text-primary-dark
                "
              >
                {{ pokemon.WeightKg }}kg
              </p>
            </div>
          </div>
          <div class="text-center py-4">
            <p class="font-bold pb-2">Abilities</p>
            <div class="grid grid-cols-2 gap-3">
              <p
                v-for="(ability, index) in pokemon.Abilities"
                :key="'abilities' + index"
                class="
                  px-10
                  py-1
                  bg-slate-100
                  rounded-full
                  dark:text-primary-dark
                "
              >
                {{ ability }}
              </p>
            </div>
          </div>
          <div class="text-center">
            <p class="font-bold">Evolutions</p>
            <div class="flex justify-evenly">
              <div
                class="flex items-center"
                v-for="(pokemon, index) in evoChain"
                :key="'chain' + index"
              >
                <p
                  v-if="pokemon.min_level"
                  class="
                    px-4
                    py-1
                    bg-slate-100
                    rounded-full
                    dark:text-primary-dark
                  "
                >
                  {{ pokemon.min_level }}
                </p>
                <img :src="pixelImageLink + pokemon.species_id + '.png'" />
              </div>
            </div>
          </div>
        </div>
        <div class="w-72 h-72 sm:m-0 mx-auto">
          <canvas id="myChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "PokemonDetails",
  data() {
    return {
      pokemon: "",
      chart: Chart,
      evoChain: [],
      apiURL: "http://localhost:8000",
      SpeciesURL: "https://pokeapi.co/api/v2/pokemon-species/",
      animatedImage:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/",
      pixelImageLink:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/",
    };
  },
  async mounted() {
    await this.loadPokemon();
    await this.loadEvolutionChain();
    this.renderChart();
    console.log(this.xd);
  },
  methods: {
    async loadPokemon() {
      const req = this.apiURL + `?id=${this.$route.params.id}`;
      this.pokemon = await fetch(req)
        .then((resp) => {
          if (resp.status === 200) {
            return resp.json();
          }
        })
        .then((json) => {
          return json.data[0];
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async loadEvolutionChain() {
      const reqSpecies = this.SpeciesURL + this.$route.params.id;
      const evoData = await fetch(reqSpecies)
        .then((resp) => {
          if (resp.status === 200) {
            return resp.json();
          }
        })
        .then((json) => {
          const reqEvolutions = json.evolution_chain.url;
          return fetch(reqEvolutions)
            .then((resp) => {
              if (resp.status === 200) {
                return resp.json();
              }
            })
            .then((json) => {
              return json.chain;
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
      this.setPokemonEvolutions(evoData);
    },
    setPokemonEvolutions(evoData) {
      do {
        let numberOfEvolutions = evoData.evolves_to.length;

        this.evoChain.push({
          species_name: evoData.species.name,
          species_id: this.filterIdFromSpeciesURL(evoData.species.url),
          min_level: !evoData.evolution_details[0]
            ? null
            : evoData.evolution_details[0].min_level,
        });
        // this.evoData.push(
        //   !evoData.evolution_details[0]
        //     ? null
        //     : evoData.evolution_details[0].min_level
        // );
        // this.evoData.push(evoData.species.name);

        if (numberOfEvolutions > 1) {
          for (let i = 1; i < numberOfEvolutions; i++) {
            this.evoChain.push({
              species_name: evoData.evolves_to[i].species.name,
              species_id: this.filterIdFromSpeciesURL(
                evoData.evolves_to[i].species.url
              ),
              min_level: !evoData.evolves_to[i].evolution_details[0]
                ? 1
                : evoData.evolves_to[i].evolution_details[0].min_level,
            });
          }
        }

        evoData = evoData.evolves_to[0];
      } while (
        evoData != undefined &&
        Object.prototype.hasOwnProperty.call(evoData, "evolves_to")
      );
    },
    filterIdFromSpeciesURL(url) {
      return url
        .replace("https://pokeapi.co/api/v2/pokemon-species/", "")
        .replace("/", "");
    },
    renderChart() {
      const ctx = document.getElementById("myChart").getContext("2d");
      console.log("ctx:", ctx);

      const myChart = new Chart(ctx, {
        type: "radar",
        data: {
          labels: [
            "HP",
            "Attack",
            "Defense",
            "Sp Attack",
            "Sp Defense",
            "Speed",
          ],
          datasets: [
            {
              data: [
                this.pokemon.Hp,
                this.pokemon.Attack,
                this.pokemon.Defense,
                this.pokemon.SpAttack,
                this.pokemon.SpDefense,
                this.pokemon.Speed,
              ],
              backgroundColor: ["rgba(0, 0, 0, 0.2)"],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          // scales: {
          //   r: {
          //     angleLines: {
          //       color: "red",
          //     },
          //     grid: {
          //       color: "red",
          //     },
          //   },
          // },
        },
      });

      myChart;
    },
    colorFromType: function (type) {
      let color;
      if (type == "normal" || type == "steel") {
        color = "bg-slate-400";
      } else if (type == "grass" || type == "bug") {
        color = "bg-lime-600";
      } else if (type == "fire") {
        color = "bg-red-500";
      } else if (type == "water") {
        color = "bg-blue-500";
      } else if (type == "electric" || type == "dragon") {
        color = "bg-amber-300";
      } else if (type == "poison") {
        color = "bg-violet-400";
      } else if (type == "dark" || type == "ghost") {
        color = "bg-gray-800 text-white";
      } else if (type == "ice" || type == "flying") {
        color = "bg-sky-300";
      } else if (type == "fighting" || type == "ground" || type == "rock") {
        color = "bg-yellow-700";
      } else if (type == "fairy" || type == "psychic") {
        color = "bg-pink-300";
      }
      return color;
    },
  },
};
</script>

<style>
.pokemon-image {
  image-rendering: pixelated;
}
</style>