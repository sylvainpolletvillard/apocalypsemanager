<template>
<div id="gameover">
  <Dialog :dialog="dialog" @endDialog="onGameOver($event)"></Dialog>
</div>

</template>

<script>
import { state } from "@/game";
import { initEndDialog, hungryDialog, tooLateDialog } from "@/events";
import { stopMusic } from "@/audio";

import Dialog from "@/components/Dialog";

export default {
  name: "Gameover",

  components: {
    Dialog
  },

  data() {
    return {
      stockChance: Math.random() * 100,
      dialog: null
    };
  },

  mounted() {
    if (!state.apocalypseTime) {
      this.$router.push("/");
    }

    stopMusic();

    let reason = this.$route.params.reason;
    switch (reason) {
      case "food":
      case "water":
        this.dialog = hungryDialog; // tlm a les crocs t tout seul lol
        break;

      case "meteor":
        this.dialog = tooLateDialog; // ta pas décollé t mort lol
        break;

      case "odyssee":
        this.dialog = initEndDialog();
        break;
    }
  },

  methods: {
    onGameOver() {
      this.$router.push("/score");
    }
  }
};
</script>

<style lang="postcss">
#gameover {
  padding: 4px;
  position: absolute;
  height: 100% !important;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-image: url("../assets/earth.jpg");
  background-size: 100% auto;
  background-position: center bottom;
  background-repeat: no-repeat;

  &.earthexploded {
    background-image: url("../assets/gameover.jpg");
    background-size: 100% 100%;
    background-position: center center;
  }

  &.ceres {
    background-image: url("../assets/ceres.jpg");
  }
}
</style>
