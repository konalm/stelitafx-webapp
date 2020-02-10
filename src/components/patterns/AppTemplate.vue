<template>
  <div>
    <b-navbar toggleable="lg" class="navbar-dark bg-primary">
      <router-link :to="{name: 'Home'}">
        <b-navbar-brand>Stelita FX</b-navbar-brand>
      </router-link>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item>
            <router-link :to="{name: 'Home'}"> Prototypes </router-link>
          </b-nav-item>

          <b-nav-item>
            <router-link :to="{name: 'Currencies'}"> Currencies </router-link>
          </b-nav-item>

          <b-nav-item>
            <router-link :to="{name: 'Monitor'}"> Monitor </router-link>
          </b-nav-item>

          <b-nav-item>
            <router-link :to="{name: 'Charting'}"> Charting </router-link>
          </b-nav-item>

          <b-nav-item>
            <router-link :to="{name: 'RatesChart'}"> Rates Chart </router-link>
          </b-nav-item>

          <b-nav-item>
            <router-link :to="{name: 'Report'}"> Report </router-link>
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
    return {}
  },
}
</script>

<style lang="scss" scoped>
.container__full-width {
  max-width: 100vw;
}
</style>
