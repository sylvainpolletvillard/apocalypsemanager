<template>
    <div class="message">
        <p>{{typedText}}</p>
    </div>
</template>

<script>
import { options } from "@/game";
import { note } from "@/baragouin";

export default {
  name: "Message",

  props: {
    text: String
  },

  data() {
    return {
      typedText: "",
      speed: 30,
      isFinished: false
    };
  },

  watch: {
    text() {
      if (this.shutup) this.shutup();
      this.typedText = "";
      this.shutup = this.machinetalk(this.text);
    }
  },

  created() {
    this.shutup = this.machinetalk(this.text);
  },

  destroyed() {
    this.shutup();
  },

  methods: {
    printAllNow() {
      this.shutup();
      this.typedText = this.text;
      this.isFinished = true;
      this.$emit("endmessage");
    },

    scrollDown() {
      let dialog = this.$el.closest(".dialog");
      if (dialog) dialog.scroll({ top: 9999, behavior: "smooth" });
    },

    machinetalk(text) {
      let parts = text.split(/\b/);
      let t = 0;
      let tone = 100;
      let coefSpeed = 1 - this.speed / 120;
      let timeouts = [];
      let scrollTimeout;

      for (let p of parts) {
        if (/\w/.test(p)) {
          let nbSyllabs = Math.ceil(p.length / 3);
          for (let s = 0; s < nbSyllabs; s++) {
            t += 100 * coefSpeed;

            if (!options.mute) {
              let freq = 440 + tone;
              timeouts.push(setTimeout(() => note(freq, 0.5 * coefSpeed), t));
            }

            timeouts.push(
              setTimeout(() => {
                this.typedText += p.slice(s * 3, s * 3 + 3);
              }, t)
            );
          }
        } else {
          timeouts.push(
            setTimeout(() => {
              this.typedText += p;
            }, t + 1)
          );
          switch (p.trim()) {
            case "":
              t += 50 * coefSpeed;
              tone = 90;
              break;
            case ",":
            case ";":
              t += 400 * coefSpeed;
              tone = 100;
              break;
            case ".":
            case ":":
            case "?":
            case "!":
            case "\n":
              t += 800 * coefSpeed;
              break;
            case "...":
              t += 1200 * coefSpeed;
              break;
            default:
              break;
          }
        }
      }

      timeouts.push(
        setTimeout(() => {
          this.isFinished = true;
          this.scrollDown();
          this.$emit("endmessage");
        }, t + 1000)
      );

      const autoscroll = () => {
        if (!this.isFinished) {
          this.scrollDown();
        }
        scrollTimeout = setTimeout(autoscroll, 100);
      };

      scrollTimeout = setTimeout(autoscroll, 100);

      return () => {
        timeouts.forEach(t => clearTimeout(t));
        clearTimeout(scrollTimeout);
      };
    }
  }
};
</script>

<style lang="postcss" scoped>
.message {
  text-align: left;

  p {
    text-shadow: 2px 3px 5px black;
    margin-bottom: 0.5em;
  }
}
</style>
