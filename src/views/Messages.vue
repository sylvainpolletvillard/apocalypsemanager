<template>
<div id="messages">
  <h1>
    <div class="icon left" v-if="currentMessage > 0" @click="currentMessage--"></div>
    {{state.messages[currentMessage].title}}
    <div class="icon right" v-if="currentMessage < state.messages.length - 1" @click="currentMessage++"></div>
  </h1>
  <Message :text="state.messages[currentMessage].text" />
</div>
</template>

<script>
import { state } from "@/game";

import Message from "@/components/Message";

export default {
  name: "Messages",

  components: { Message },

  data() {
    return {
      currentMessage: state.messages.length - 1,
      state
    };
  },

  mounted() {
    state.hasNewMessage = false;
  }
};
</script>

<style lang="postcss">
#messages {
  height: calc(100% - 64px);
  border-radius: 8px;
  background-color: rgba(50, 40, 30, 0.05);
  color: goldenrod;

  h1 {
    position: relative;

    .icon {
      display: inline-block;
      width: 1.3em;
      height: 1.3em;
      background-size: 100% 100%;
      position: absolute;
      top: 0.2em;

      &.left {
        left: 8px;
      }

      &.right {
        right: 8px;
      }
    }
  }
}
</style>

