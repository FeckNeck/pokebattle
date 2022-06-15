<template>
  <div v-if="pokemon" class="m-auto py-2">
    <div class="border shadow-login rounded m-auto py-4 px-5">
      <div>
        <p class="text-3xl">
          #{{ pokemon.PokedexNumber }} - {{ pokemon.Name }}
        </p>
      </div>
      <div class="flex items-center pt-4">
        <div class="px-7">
          <img
            class="w-64 pb-4 pokemon-image"
            :src="animatedImage + pokemon.PokedexNumber + '.gif'"
          />
          <div class="flex justify-evenly">
            <p class="py-1 px-2 bg-slate-100 rounded border">
              {{ pokemon.Types[0].toUpperCase() }}
            </p>
            <p
              v-if="pokemon.Types[1]"
              class="py-1 px-2 bg-slate-100 rounded border"
            >
              {{ pokemon.Types[1].toUpperCase() }}
            </p>
          </div>
        </div>
        <div>
          <div class="flex justify-evenly text-center">
            <div class="pr-2">
              <p class="font-bold pb-2">Height</p>
              <p class="px-10 py-1 rounded-full bg-slate-100">
                {{ pokemon.HeightM }}m
              </p>
            </div>
            <div class="pf-2">
              <p class="font-bold pb-2">Weight</p>
              <p class="px-10 py-1 rounded-full bg-slate-100">
                {{ pokemon.WeightKg }}kg
              </p>
            </div>
          </div>
          <div class="py-8 text-center">
            <p class="pb-2 font-bold">Abilities</p>
            <div class="grid grid-cols-2 gap-3">
              <p
                v-for="(ability, index) in pokemon.Abilities"
                :key="'abilities' + index"
                class="px-10 py-1 bg-slate-100 rounded-full"
              >
                {{ ability }}
              </p>
            </div>
          </div>
          <div class="text-center">
            <p class="pb-2 font-bold">Evolutions</p>
            <div class="flex justify-between">
              <div
                class="flex items-center"
                v-for="(pokemon, index) in evoChain"
                :key="'chain' + index"
              >
                <p v-if="pokemon.min_level">{{ pokemon.min_level }}</p>
                <img :src="pixelImageLink + pokemon.species_id + '.png'" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <p>{{ pokemon.Hp }}</p>
          <div
            class="bg-black h-4"
            :style="{ width: renderChart(pokemon.Hp) }"
          ></div>
        </div>
        <div>
          <p>{{ pokemon.Attack }}</p>
          <div
            class="bg-black h-4"
            :style="{ width: renderChart(pokemon.Attack) }"
          ></div>
        </div>
        <div>
          <p>{{ pokemon.Defense }}</p>
          <div
            class="bg-black h-4"
            :style="{ width: renderChart(pokemon.Defense) }"
          ></div>
        </div>
        <div>
          <p>{{ pokemon.Speed }}</p>
          <div
            class="bg-black h-4"
            :style="{ width: renderChart(pokemon.Speed) }"
          ></div>
        </div>
        <div>
          <p>{{ pokemon.SpAttack }}</p>
          <div
            class="bg-black h-4"
            :style="{ width: renderChart(pokemon.Defense) }"
          ></div>
        </div>
        <div>
          <p>{{ pokemon.SpDefense }}</p>
          <div
            class="bg-black h-4"
            :style="{ width: renderChart(pokemon.Speed) }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PokemonDetails",
  data() {
    return {
      pokemon: "",
      evoChain: [],
      apiURL: "http://localhost:8000",
      SpeciesURL: "https://pokeapi.co/api/v2/pokemon-species/",
      animatedImage:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/",
      pixelImageLink:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/",
    };
  },
  mounted() {
    this.loadPokemon();
    this.loadEvolutionChain();
  },
  methods: {
    renderChart(element) {
      const size = (element / 200) * 100;
      return size + "px";
    },
    loadPokemon() {
      const req = this.apiURL + `?id=${this.$route.params.id}`;
      fetch(req)
        .then((resp) => {
          if (resp.status === 200) {
            return resp.json();
          }
        })
        .then((json) => {
          this.pokemon = json.data[0];
          console.log("this.pokemon:", this.pokemon);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async loadEvolutionChain() {
      const reqSpecies = this.SpeciesURL + this.$route.params.id;
      let evoData = await fetch(reqSpecies)
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
        console.log("numberOfEvolutions:", numberOfEvolutions);

        this.evoChain.push({
          species_name: evoData.species.name,
          species_id: this.filterIdFromSpeciesURL(evoData.species.url),
          min_level: !evoData.evolution_details[0]
            ? null
            : evoData.evolution_details[0].min_level,
        });

        if (numberOfEvolutions > 1) {
          for (let i = 1; i < numberOfEvolutions; i++) {
            console.log(
              "xd",
              evoData.evolves_to[i].evolution_details[0].min_level
            );
            this.evoChain.push({
              species_name: evoData.evolves_to[i].species.name,
              species_id: this.filterIdFromSpeciesURL(
                evoData.evolves_to[i].species.url
              ),
              min_level: !evoData.evolves_to[i].evolution_details[0]
                ? 1
                : evoData.evolves_to[i].evolution_details[0].min_level,
              trigger_name: !evoData.evolves_to[i]
                ? null
                : evoData.evolves_to[i].trigger.name,
              item: !evoData.evolves_to[i] ? null : evoData.evolves_to[i].item,
            });
          }
        }

        evoData = evoData.evolves_to[0];
      } while (
        evoData != undefined &&
        Object.prototype.hasOwnProperty.call(evoData, "evolves_to")
      );

      console.log(this.evoChain);
    },
    filterIdFromSpeciesURL(url) {
      return url
        .replace("https://pokeapi.co/api/v2/pokemon-species/", "")
        .replace("/", "");
    },
  },
};
</script>

<style>
.pokemon-image {
  image-rendering: pixelated;
}
</style>