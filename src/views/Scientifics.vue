<template>
    <div id="scientifics">
      <h1>Equipes scientifiques</h1>
        <ul>
            <Scientific v-for="(sc, i) in state.scientifics" :key="i" :indexScientific="i" :showStatus="true" />
        </ul>
        <template v-if="state.scientifics.length === 0">
          <h1 >Aucune équipe scientifique sous vos ordres</h1>
          <p>Vous avez besoin de scientifiques pour développer les technologies nécessaires à la mission Odyssée</p>
        </template>
    </div>
</template>

<script>
import Scientific from "@/components/Scientific";
import { state } from "@/game";

export default {
  name: "Scientifics",

  components: {
    Scientific
  },

  data() {
    return {
      state
    };
  }
};
</script>

<style lang="postcss" scoped>
</style>


