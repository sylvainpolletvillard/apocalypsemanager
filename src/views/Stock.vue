<template>
    <div id="stock">
        <h1>Ressources en stock</h1>
        <ul class="ressources">
            <li v-for="ressource in ressources" :key="ressource.key"
            :class="['ressource','item', ressource.key]">
                <div :class="['icon', ressource.key]"></div>
                <span :class="['stock', { low: isLow(ressource), empty: isEmpty(ressource) }]">{{ressource.stock}}</span>
                <span class="name">{{ressource.name}}</span>
                <p class="description">{{ressource.description}}</p>
            </li>
        </ul>
        <div class="consommation" v-if="ressourcesConsumedPerDay.length > 0">
        <h1>Consommation par jour</h1>
        <p>Les escouades et équipes scientifiques ont besoin de boire et manger. Veillez à garder des réserves suffisantes.</p>
        <ul>
          <li v-for="[res, val] in ressourcesConsumedPerDay" :key="res">
            -{{val}} <div :class="['icon',res]" :title="res"></div>
          </li>
        </ul>
        </div>

        <div class="production" v-if="ressourcesProducedPerDay.length > 0">
        <h1>Production par jour</h1>
        <ul>
          <li v-for="[res, val] in ressourcesProducedPerDay" :key="res">
            +{{val}} <div :class="['icon',res]"></div>
          </li>
        </ul>
        </div>
    </div>
</template>

<script>
import { state } from "@/game";
import { ressources } from "@/ressources";

export default {
  name: "Stock",

  data() {
    return { state };
  },

  computed: {
    ressources() {
      return Object.entries(this.state.ressources).map(([key, stock]) => {
        return { key, stock, ...ressources[key] };
      });
    },
    ressourcesConsumedPerDay() {
      return Object.entries(this.state.ressourcesConsumptionPerDay)
        .filter(([, val]) => val !== 0)
        .map(([res, val]) => [
          res,
          Math.round(val * this.state.ressourcesConsumptionFactor[res])
        ]);
    },
    ressourcesProducedPerDay() {
      return Object.entries(this.state.ressourcesProductionPerDay).filter(
        ([, val]) => val !== 0
      );
    }
  },

  methods: {
    isLow(ressource) {
      return (
        ["food", "water", "fuel"].includes(ressource.key) && ressource.stock < 9
      );
    },
    isEmpty(ressource) {
      return (
        ["food", "water", "fuel"].includes(ressource.key) &&
        ressource.stock === 0
      );
    }
  }
};
</script>

<style lang="postcss" scoped>
p {
  margin: 0;
  line-height: 1;
  padding: 0 0.25em;
}

.consommation,
.production {
  p {
    margin: 0.5em 0;
  }

  li {
    display: inline-block;
    margin: 0 0.5em;
    font-size: 1.5em;
  }

  .icon {
    display: inline-block;
    height: 48px;
    width: 48px;
    background-size: 48px 48px;
    vertical-align: middle;
  }
}

.ressource {
  .icon {
    float: left;
    width: 48px;
    height: 48px;
    margin: 6px;
  }

  .name {
    padding-top: 4px;
    display: block;
  }

  .description {
    font-size: 0.75em;
    margin: -4px 4px 0 4px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .stock {
    float: right;
    font-size: 1.4em;
    margin: 0.3em 0.5em;

    &.low {
      color: goldenrod;
    }

    &.empty {
      color: red;
    }
  }
}
</style>

