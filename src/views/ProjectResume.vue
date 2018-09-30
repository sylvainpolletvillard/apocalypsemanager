<template>
<div id="projectresume" v-if="project">
    <h1>Projet</h1>
    <ul>
        <li class="project">
            <span class="name">{{project.name}}</span>
            <p class="description">{{project.description}}</p>
        </li>
    </ul>
    <h1>Résultat du projet</h1>
    <div class="resultat" @click="$router.push('/scientifics')">
        <h2>Projet terminé !</h2>
        <p>Résultats:
            <ul>
                <li v-for="(gain,i) in scientific.project.gains" :key="i">{{gain.description}}</li>
            </ul>
        </p>
    </div>
</div>
</template>

<script>
import { state } from "@/game";
import { projectResume } from "@/projects";
import { clone } from "@/utils";

export default {
  name: "projectResume",

  data() {
    return { project: null, scientific: null };
  },

  created() {
    let scientific = state.scientifics[this.indexScientific];
    this.scientific = clone(scientific);
    this.project = this.scientific.project;
    projectResume(scientific);
  },

  computed: {
    indexScientific() {
      return parseInt(this.$route.params.indexScientific);
    }
  }
};
</script>

<style lang="postcss" scoped>
h1 {
  background-color: rgba(255, 255, 255, 0.1);

  &:first-of-type {
    margin: 0;
  }

  &:not(:first-of-type) {
    margin-top: 0;
    margin-bottom: 0.5em;
  }
}

.icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-size: 24px 24px;
  margin: 0 0.5em 0 0;
  vertical-align: middle;
}

.ressources li {
  display: inline-block;
  margin: 8px 0;
}

.resultat {
  cursor: pointer;
  .icon {
    width: 48px;
    height: 48px;
    background-size: 48px 48px;
    margin: 0;
  }
}

p {
  padding: 0 0.5em;
}

li.project {
  background-image: url("../assets/project.png");
  background-size: 100% 100%;
  text-align: left;
  padding: 24px;
  position: relative;

  p {
    line-height: 1;
    font-size: 0.8em;
    margin-bottom: 4px;
  }
}
</style>

