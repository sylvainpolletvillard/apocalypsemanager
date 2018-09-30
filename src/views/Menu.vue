<template>
<div id="menu">
<h1>Apocalypse Manager</h1>

<img id="earth" :src="imageEarth">

<div id="loading" v-if="!state.loaded">
    <div class="bar">
        <div id="loadingProgress" class="barcompleted"></div>
        <p>Chargement... {{loadingPc}} %</p>
    </div>
</div>

<ul v-else>
    <li class="action" v-if="hasSavedGame">
        <a @click="continueGame()">Continuer la partie</a>
    </li>
     <li class="action">
        <a @click="newGame()">Nouvelle partie</a>
    </li>
    <li class="action">
       <a class="icon left" @click="nextMode(-1)"></a>
        {{selectedMode.label}}
        <small>{{selectedMode.description}}</small>
        <a class="icon right" @click="nextMode(+1)"></a>
    </li>
    <li class="action">
        <a @click="toggleMute()">Musique et sons: {{options.mute ? "OFF" : "ON"}}</a>
    </li>

    <li class="action">
        <router-link to="/credits">Crédits</router-link>
    </li>
</ul>

<p class="bestscore" v-if="bestScore">Meilleur score: {{bestScore}}</p>

<footer>
    v{{version}}
</footer>
</div>
</template>

<script>
import {
  state,
  options,
  modes,
  version,
  loadSavedGame,
  hasSavedGame,
  getBestScore
} from "@/game";
import { preloadGame } from "@/preloader";
import { playMusic, stopMusic, SOUNDS } from "@/audio";

import imageEarth from "@/assets/earth.jpg";

export default {
  name: "Menu",

  data() {
    return {
      state,
      options,
      selectedMode: modes[1],
      version,
      loadingPc: 0,
      hasSavedGame: hasSavedGame(),
      imageEarth
    };
  },

  mounted() {
    document.getElementById("app").style.backgroundSize = "80vh";
    document.getElementById("app").style.backgroundPosition = "center -40vh";

    if (!state.loaded) {
      document.getElementById("loadingProgress").style.width = "0%";
      preloadGame(this.onProgress).then(({ sounds }) => {
        Object.assign(SOUNDS, sounds);
        state.loaded = true;
      });
    }
  },

  computed: {
    bestScore() {
      return getBestScore(this.selectedMode);
    }
  },

  methods: {
    onProgress(pc) {
      this.loadingPc = Math.round(pc);
      document.getElementById("loadingProgress").style.width = pc + "%";
    },

    newGame() {
      this.state.mode = this.selectedMode;
      this.$router.push("/newgame");
    },

    continueGame() {
      loadSavedGame();
      this.$router.push("/game/");
    },

    toggleMute() {
      options.mute = !options.mute;
      if (options.mute) {
        stopMusic();
      } else {
        playMusic("TitleScreen");
      }
    },

    nextMode(n = 1) {
      let i = modes.indexOf(this.selectedMode);
      this.selectedMode = modes[(i + modes.length + n) % modes.length];
    }
  }
};
</script>


<style lang="postcss" scoped>
#menu {
  max-height: none;
  overflow: visible;
}

#loading {
  font-size: 1.6em;
}

#loading,
ul {
  position: absolute;
  top: 40vh;
  left: 0;
  right: 0;
}

li {
  padding: 0.25em 40px;
}

li .icon {
  display: inline-block;
  height: 100%;
  width: 32px;
  background-size: 32px 32px;
  background-position: center center;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  bottom: 0;

  &.left {
    left: 8px;
  }

  &.right {
    left: auto;
    right: 8px;
  }
}

li small {
  font-size: 0.75em;
  display: block;
  margin: -0.2em auto 0.2em auto;
}

h1 {
  position: relative;
  top: 50px;
  font-size: 1.5em;
  margin: 0;
  padding: 0.5em 0.1em;
}

.bar {
  background: rgba(255, 255, 255, 0.1);
  padding: 16px 8px;
  display: block;
  margin: 0.5em 0;
  position: relative;
}

.barcompleted {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: goldenrod;
  opacity: 0.25;
}

footer,
.bestscore {
  position: absolute;
  bottom: 8px;
  color: white;
  font-size: 0.8em;
}

footer {
  right: 8px;
}

.bestscore {
  left: 8px;
  font-size: 1em;
}

#earth {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
}
</style>

