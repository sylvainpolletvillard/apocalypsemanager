<template>
<div id="credits">
  <Message v-for="(text,i) in textsPrinted" :key="i" :text="text" @endmessage="nextParagraph()"></Message>
  <div class="action">
      <router-link to="/">Retour au menu</router-link>
  </div>
</div>
</template>

<script>
import Message from "@/components/Message";

export default {
  name: "Credits",
  components: { Message },
  data() {
    return {
      texts: [
        `Ce jeu a été réalisé en un week-end à l'occasion de la 8ème édition du Game Dev WeekEnd sur Developpez.com.`,
        `L'intégralité du développement a été diffusé en live streaming sur Youtube, et est disponible sur la chaîne de Sylvain Pollet-Villard.`,
        `Les musiques et effets sonores ont été composés et produits par Romain Proyart, que vous pouvez retrouver sur son SoundCloud proyartromain.`,
        `Thanks for playing my game.`
      ],
      textsPrinted: []
    };
  },
  created() {
    this.nextParagraph();
  },

  methods: {
    nextParagraph() {
      let nextParagraph = this.texts.shift();
      if (nextParagraph) this.textsPrinted.push(nextParagraph);
    }
  }
};
</script>

<style lang="postcss" scoped>
#credits {
  position: absolute;
  top: 1em;
  bottom: 1em;
  left: 1em;
  right: 1em;
  padding: 1em;
  max-height: none;
  height: auto;
  text-align: left;
  color: goldenrod;

  .message {
    font-size: 1.2em;
    margin-bottom: 1em;
  }

  .action {
    position: absolute;
    bottom: 1em;
    left: 0;
    right: 0;
  }
}
</style>
