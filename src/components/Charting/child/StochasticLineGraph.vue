<template>
  <div>
    <div v-bind:id="domClassName"></div>
  </div>
</template>

<script>
import { getStochastics } from '@/http/stochastic'
import { buildLineGraph, clearLineGraph } from '@/graph/lineGraph';

export default {
  props: {
    abbrev: {
      type: String,
      required: true
    },
    interval: {
      type: Number,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    currencyRateSrc: {
      type: String,
      required: true
    },
    offset: {
      type: Number,
      required: true
    }
  },

  beforeMount() {
    this.uploadStochastics()
  },

  data() {
    return {
      stochastics: []
    }
  },

  computed: {
    domClassName() {
      return 'stochasticsGraph'
    },

    lineGraphData() {
      const stochastics = [...this.stochastics]

      stochastics.forEach((x) => {
        x.overBought = 80
        x.overSold = 20
      })

      const details = [
        {
          key: 'stochastic',
          colour: 'blue',
          width: 3
        },
        {
          key: 'overBought',
          colour: 'cyan',
          width: 2
        },
        {
          key: 'overSold',
          colour: 'cyan',
          width: 2
        }
      ]

      return { dataPoints: stochastics, details}
    }
  },

  methods: {
    updateGraph() {
      clearLineGraph(this.domClassName)

      buildLineGraph(
        this.lineGraphData,
        this.domClassName,
        window.innerWidth,
        window.innerHeight / 4,
        80
      )
    },

    uploadStochastics() {
      console.log('upload stochastics')
      getStochastics(this.abbrev, this.interval, this.count, this.offset)
        .then(res => {
          this.stochastics = res
        })
    }
  },

  watch: {
    lineGraphData() {
      this.updateGraph()
    },

    abbrev() {
      this.uploadStochastics()
    },
    interval() {
      this.uploadStochastics()
    },
    count() {
      this.uploadStochastics()
    },
    currencyRateSrc() {
      this.uploadStochastics()
    },
    offset() {
      this.uploadStochastics()
    }

  }
}
</script>
