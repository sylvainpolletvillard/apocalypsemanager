<template>
  <div id="game">
    <countdown />
    <router-view/>
    <footer id="nav">
      <div class="round button">
        <router-link to="/game/">
        <div class="icon rocket"></div>
        Mission Odyssée
        </router-link>
      </div>
      <ul>
        <li class="button missions">
          <router-link to="/squads">
          <div class="icon"></div>
          Squad
          </router-link>
        </li>
        <li class="button labo">
          <router-link to="/scientifics">
          <div class="icon"></div>
          Labo
          </router-link>
        </li>
        <li class="button stock">
          <router-link to="/stock">
          <div class="icon"></div>
          Stock
          </router-link>
        </li>

        <li class="button map" :class="{ new: state.hasNewMessage }">
          <router-link to="/messages">
          <div class="icon"></div>
          Com
          </router-link>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
import Countdown from "@/components/Countdown";
import { formatTime } from "@/labels";
import { state, saveGame } from "@/game";
import { loadEpoch } from "@/events";

export default {
  name: "App",
  components: {
    Countdown
  },
  data() {
    return {
      state
    };
  },
  methods: {
    formatTime
  },

  created() {
    if (!state.loaded) return this.$router.push("/");
    loadEpoch();

    this.interval = setInterval(() => saveGame(), 5000);
  },
  mounted() {
    document.getElementById("app").style.backgroundSize = "1px";
    document.getElementById("app").style.backgroundPosition = "center center";
  },
  destroyed() {
    clearInterval(this.interval);
  }
};
</script>

<style lang="postcss">
#game .countdown + div {
  max-height: calc(100vh - 48px);
  padding-bottom: 200px;
  overflow: auto;
}

@keyframes blink {
  0% {
    filter: brightness(1);
  }
  49% {
    filter: brightness(2);
  }
  99% {
    filter: brightness(1);
  }
}

.button {
  a {
    display: inline-block;
    text-align: center;
    height: 128px;
    width: 128px;
    max-width: calc(100vh * 1080 / 1920 / 4);
    background-image: url("../assets/button.png");
    background-size: 300% 128px;
    background-position: -200% 0;

    &:hover {
      background-position: -100% 0;
    }

    &.router-link-exact-active {
      background-position: 0 0;
    }
  }

  &.round a {
    width: 512px;
    height: 64px;
    padding-top: 24px;
    max-width: calc(100vh * 1080 / 1920);
    background-size: 100% 128px;
    background-image: url("../assets/round-button.png");

    &:hover,
    &.router-link-exact-active {
      background-position: 0 -64px;
    }
  }

  .icon {
    width: 48px;
    height: 48px;
    margin: 16px auto 8px auto;
    display: block;
    background-repeat: no-repeat;
  }

  .icon.rocket {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    background-size: 24px 24px;
    display: inline-block;
    margin: 0 0.5em 0 0;
  }

  &.new {
    animation: blink 1s linear infinite;
  }
}
</style>
