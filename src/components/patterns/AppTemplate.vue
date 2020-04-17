<template>
  <div>
    <b-navbar toggleable="lg" class="navbar-dark bg-primary">
      <router-link :to="{name: 'Home'}">
        <b-navbar-brand>Stelita FX</b-navbar-brand>
      </router-link>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-for="link in links" :key="link.name">
            <router-link :to="{name: link.name}"> {{ link.txt }} </router-link>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-container class="mt-4" v-bind:class="className">
      <slot></slot>
    </b-container>
  </div>
</template>


<script>
export default {
  props: {
    className: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      links: [
        {
          name: 'Strategies',
          txt: 'Strategies'
        },
        // {
        //   name: 'Currencies',
        //   txt: 'Currencies'
        // },
        // {
        //   name: 'Monitor',
        //   txt: 'Monitor'
        // },
        {
          name: 'Charting',
          txt: 'Charting'
        },
        // {
        //   name: 'RatesChart',
        //   txt: 'Rates Chart'
        // },
        // {
        //   name: 'Report',
        //   txt: 'Report'
        // },
        {
          name: 'Simulator',
          txt: 'Simulator'
        },
        {
          name: 'CandlePatterns',
          txt: 'Candle Patterns'
        }
      ]
    }
  },
}
</script>


<style lang="scss" scoped>
.container__full-width {
  max-width: 100vw;
}
</style>
