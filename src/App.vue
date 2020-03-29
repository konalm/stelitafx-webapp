<template>
  <div id="app">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>


<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.small-font {
  font-size: 12px;
}

.slim {
  height: 25px;
  padding: 4px;
  font-size: 12px;
}

.Gain, .Profit, .gained {
  fill: #28a745;
}

.Loss, .lost {
  fill: #dc3545;
}

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 2px;
}

.grid line, .x-grid line {
  stroke: lightgrey;
  stroke-opacity: 0.7;
  shape-rendering: crispEdges;
}

.x-grid path,  {
  stroke-width: 0;
}

</style>
