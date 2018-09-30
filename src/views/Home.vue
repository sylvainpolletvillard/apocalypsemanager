<template>
  <div class="home">
    <Score />
  </div>
</template>

<script>
// @ is an alias to /src
import Score from "@/components/Score.vue";

export default {
  name: "home",
  components: {
    Score
  }
};
</script>
