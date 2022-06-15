<template>
  <PokemonList :apiUrl="apiUrl" ></PokemonList>
</template>

<script>
import PokemonList from "@/components/PokemonList.vue";

export default{
    name: 'PokedexView',
    components: {
        PokemonList,
    },
    data(){
      return{
        apiUrl:'http://localhost:8000',
      }
    },
}
</script>

<style>

</style>