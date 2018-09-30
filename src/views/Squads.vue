<template>
    <div id="squads">
        <h1>Missions</h1>
        <ul>
            <Squad v-for="(squad, i) in squads" :key="i" :indexSquad="i" :showStatus="true" />
        </ul>
        <template v-if="squads.length === 0">
          <h1>Aucune escouade sous vos ordres</h1>
          <p>Vous avez besoin de troupes pour récupérer les ressources nécessaires à la mission Odyssée</p>
        </template>
    </div>
</template>

<script>
import Squad from "@/components/Squad";
import { state } from "@/game";

export default {
  name: "Squads",

  components: {
    Squad
  },

  data() {
    return {
      squads: state.squads
    };
  },

  methods: {}
};
</script>

<style lang="postcss">
</style>


