<template>
    <div class="flex justify-center py-5 flex-wrap">
        <div class="grid grid-cols-5 gap-6">
            <div v-for="(pokemon, index) in pokemons" 
            :key="'poke'+index"
            :class="colorFromType(pokemon.Types[0])"
            class="h-fit p-4 shadow-login border rounded transition-all duration-300 ease-in-out
            hover:cursor-pointer hover:-translate-y-up"
            @click="this.$router.push(
                { name: 'pokemonDetails', 
                params: { id: pokemon.PokedexNumber } 
                }
            )">
                <img class="transition-all pokemon-image" :src="pixelImageLink+pokemon.PokedexNumber+'.png'">
                <p class="text-center">{{pokemon.Name}}</p>
            </div>
        </div>
    </div>
</template>
<!-- @mouseover="$event.currentTarget.firstElementChild.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.PokedexNumber}.png`" -->
<script>

//console.log(this.$route.query.id);

export default {
    data(){
        return{
            nextURL:"",
            pokemons: [],
            pixelImageLink: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
        };
    },
    props:{
        apiUrl:String 
    },
    created(){
        this.fetchPokemons();
        console.log(this.pokemons);
    },
    methods:{
        fetchPokemons(){
            fetch(this.apiUrl)
            .then( (resp) => {
                console.log(resp);
                if(resp.status === 200){
                    return resp.json();
                }
            })
            .then((data) => {
                console.log('data:', data.data);
                this.pokemons = data.data;
            })
            .catch( (error) => {
                console.log(error);
            })
        },
        colorFromType: function(type){
            let color;
            if(type == "normal" || type == "steel"){
                color = "border-b-2 border-b-slate-400";
            }
            else if(type == "grass" || type == "bug"){
                color = "border-b-2 border-b-lime-600";
            }else if(type == "fire"){
                color = "border-b-2 border-b-red-500";
            }else if(type == "water"){
                color = "border-b-2 border-b-blue-500";
            }else if(type == "electric" || type == "dragon"){
                color = "border-b-2 border-b-amber-300";
            }else if(type == "poison"){
                color = "border-b-2 border-b-violet-400";
            }else if(type == "dark" || type == "ghost"){
                color = "border-b-2 border-b-gray-800";
            }else if(type == "ice" || type == "flying"){
                color = "border-b-2 border-b-sky-300";
            }else if(type == "fighting" || type == "ground" || type == "rock"){
                color = "border-b-2 border-b-yellow-700";
            }else if(type == "fairy"){
                color = "border-b-2 border-b-pink-300";
            }
            return color;
        },
    },
}
</script>

<style>
.pokemon-image{
    image-rendering: pixelated;
}
</style>