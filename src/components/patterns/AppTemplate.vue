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
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="container mt-4">
      <slot></slot>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {}
  },
}
</script>
