<template>
    <div id="project" v-if="scientific">
        <ul>
            <Scientific :indexScientific="indexScientific" />
        </ul>
        <h1>Projets de recherche</h1>
        <ul>
            <li v-for="(project,i) in projects" :key="i"
                v-if="(!selectedProject && isProjectAvailable(project)) || selectedProject === project"
                class="project"
                @click="selectProject(project)">
                <span class="name">{{project.name}}</span>
                <p class="description" v-if="selectedProject === project">{{project.description}}</p>

                <ul class="gains">
                    <li v-for="(gain, i) in project.gains" :key="i">
                        <p>{{gain.description}}</p>
                    </li>
                </ul>
                <p :class="['level', { insufficient: project.level > scientific.level }]">
                  Niveau requis:
                  <span>{{project.level}}</span>
                </p>
            </li>
        </ul>

        <template v-if="selectedProject">
        <h1>Durée du projet de recherche</h1>
        <div class="params">
            <span class="duree">{{dureeProject}} h</span>

            <p class="ressources" v-if="requiresRessources">Ressources requises:
                <ul>
                    <li v-for="(val,res) in requiredRessources" :key="res"
                        :class="{ insufficient: !hasRessources({ [res]: val }) }">
                        <template v-if="val > 0">
                          {{val}} <div :class="['icon', res]"></div>
                        </template>
                    </li>
                </ul>
            </p>
        </div>


        <div class="action disabled" v-if="scientific.level < selectedProject.level">
          <a>Niveau insuffisant</a>
        </div>
        <div class="action disabled" v-else-if="!hasRessources(requiredRessources)">
          <a>Ressources insuffisantes</a>
        </div>
        <div class="action" v-else-if="canStartProject">
            <a @click="startProject()">Démarrer le projet</a>
        </div>
        </template>

        <template v-if="projectsFinished.length > 0">
        <h1>Projets terminés</h1>
        <ul>
            <li v-for="(project,i) in projectsFinished" :key="i" class="project done">
                <span class="name">{{project.name}}</span>
                <ul class="gains">
                    <li v-for="(gain, i) in project.gains" :key="i">
                        <p>{{gain.description}}</p>
                    </li>
                </ul>
            </li>
        </ul>
        </template>
    </div>
</template>

<script>
import Scientific from "@/components/Scientific.vue";
import { projects, startProject, calcRequiredRessources } from "@/projects.js";
import { hasRessources, takeRessources } from "@/ressources.js";
import { state } from "@/game.js";
import { formatTime } from "@/labels";

export default {
  name: "Project",
  components: { Scientific },

  data() {
    return {
      state,
      projects,
      selectedProject: null
    };
  },

  computed: {
    indexScientific() {
      return parseInt(this.$route.params.indexScientific);
    },
    canStartProject() {
      return (
        this.selectedProject &&
        this.isProjectAvailable(this.selectedProject) &&
        hasRessources(this.requiredRessources) &&
        this.scientific.level >= this.selectedProject.level
      );
    },
    requiresRessources() {
      return Object.values(this.selectedProject.ressources).some(
        val => val > 0
      );
    },
    requiredRessources() {
      if (!this.selectedProject) return null;
      return calcRequiredRessources(this.selectedProject);
    },
    scientific() {
      return this.state.scientifics[this.indexScientific];
    },
    dureeProject() {
      return formatTime(
        this.selectedProject.duree *
          1000 *
          this.state.researchTimeFactor *
          this.state.speed
      );
    },

    projectsFinished() {
      return this.state.projectsFinished.map(projectName =>
        projects.find(p => p.name === projectName)
      );
    }
  },

  methods: {
    hasRessources,

    selectProject(project) {
      if (this.selectedProject) {
        this.selectedProject = null;
      } else if (this.isProjectAvailable(project)) {
        this.selectedProject = project;
      }
    },

    startProject() {
      takeRessources(this.requiredRessources);
      startProject(this.scientific, this.selectedProject);
      this.$router.push("/scientifics");
    },

    isProjectAvailable(project) {
      return (
        !this.state.projectsStarted.includes(project.name) || project.infinite
      );
    }
  }
};
</script>

<style lang="postcss" scoped>
.ressources ul {
  display: inline-block;
  vertical-align: text-bottom;

  margin-left: 0.5em;

  li {
    display: inline-block;
    vertical-align: text-bottom;

    .icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      background-size: 24px 24px;
      margin: 0 0.5em 0 0;
      vertical-align: middle;
    }
  }
}

.project {
  background-image: url("../assets/project.png");
  background-size: 100% 100%;
  text-align: left;
  padding: 4px 64px 12px 16px;
  position: relative;

  &:not(.done) {
    cursor: pointer;
    &:hover {
      filter: contrast(1.1) brightness(1.1);
    }
  }

  &.done {
    filter: contrast(0.85) brightness(0.5);
  }

  &.done::after {
    content: url("../assets/icon-tick.png");
    position: absolute;
    right: 16px;
    top: 24px;
  }

  p {
    line-height: 1;
    font-size: 0.8em;
    margin-bottom: 4px;
  }
}

.params {
  background-image: url("../assets/science.png");
  background-size: 100% 100%;
  padding: 4px 16px;
  min-height: 96px;

  .duree {
    margin-left: 1em;
    padding: 0.25em;
    display: inline-block;
  }

  .ressources {
    text-align: left;
  }
}

li.scientific {
  margin-top: 0.25em;
}

.insufficient {
  color: red;
}
</style>


