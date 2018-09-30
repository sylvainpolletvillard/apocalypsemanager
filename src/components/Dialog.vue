<template>
<div class="dialog" @click="forceNextLine($event)">
    <Message v-for="(line,i) in lines" :key="i" ref="lines" :text="line" @endmessage="printNextLine()" />

    <ul class="actions" v-if="showActions">
        <li v-for="(action,j) in actions" :key="j" class="action" v-if="shouldShowAction(action)">
            <a @click="goToPart(action.link)">{{action.text}}</a>
        </li>
    </ul>
</div>
</template>

<script>
import Message from "@/components/Message";

export default {
  name: "Dialog",

  components: {
    Message
  },

  props: {
    dialog: {
      start: String,
      end: String,
      actions: Array,
      parts: Object
    }
  },

  data() {
    return {
      lines: [],
      currentLine: 0,
      currentPartName: null,
      currentPart: null,
      partsSeen: new Set(),
      showActions: false
    };
  },

  computed: {
    actions() {
      return (this.currentPart.actions || this.dialog.actions || []).filter(
        action => !action.showIf || action.showIf()
      );
    }
  },

  mounted() {
    this.startDialog();
  },

  watch: {
    dialog() {
      this.startDialog();
    }
  },

  methods: {
    startDialog() {
      if (this.dialog) {
        this.goToPart(this.dialog.start || "start");
      }
    },

    goToPart(part, preserveExistingLines = false) {
      if (part === (this.dialog.end || "end")) {
        this.$emit("endDialog", this.currentPartName);
      } else {
        this.currentPartName = part;
        this.currentPart = this.dialog.parts[part];
        if (typeof this.currentPart === "function") {
          this.currentPart = this.currentPart();
        }

        this.currentLine = -1;
        this.showActions = false;
        if (!preserveExistingLines) this.lines = [];
        if (this.currentPart.onStart) this.currentPart.onStart();
        this.printNextLine();
      }
    },

    printNextLine() {
      this.currentLine++;
      if (this.currentLine >= this.currentPart.lines.length) {
        this.partsSeen.add(this.currentPartName);
        if (this.currentPart.onEnd) this.currentPart.onEnd();
        if (this.currentPart.chainWith) {
          this.goToPart(this.currentPart.chainWith, true);
        } else {
          this.showActions = true;
          this.$nextTick(() => {
            this.$el.scroll({ top: 9999, left: 0, behavior: "smooth" });
          });
        }
      } else {
        this.lines.push(this.currentPart.lines[this.currentLine]);
      }
    },

    forceNextLine(event) {
      if (
        event.target.closest(".action") === null &&
        this.currentLine < this.currentPart.lines.length
      ) {
        this.$refs.lines[this.lines.length - 1].printAllNow();
      }
    },

    shouldShowAction(action) {
      return !this.partsSeen.has(action.link);
    }
  }
};
</script>

<style lang="postcss" scoped>
.dialog {
  border: 1px solid goldenrod;
  padding: 0.5em 0;
  height: 100%;
  overflow: auto;
  text-align: left;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: transparent;
}

::-webkit-scrollbar {
  width: 3px;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: goldenrod;
}

.actions {
  margin: 1em 0 0 0;
}

.action {
  margin-top: 0.5em;
}
</style>


