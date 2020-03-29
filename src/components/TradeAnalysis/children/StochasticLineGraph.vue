<template>
  <div>
    <div v-bind:id="domClassName" class="stochastic-line-graph"></div>
  </div>
</template>

<script>
import { getStochasticsForTrade } from '@/http/stochastic'
import { buildLineGraph, clearLineGraph } from '@/graph/lineGraph';

export default {
  props: {
    prototypeNumber: {
      type: Number,
      required: true
    },
    interval: {
      required: true
    },
    tradeId: {
      type: Number,
      required: true
    },
    tradeUUID: {
      type: String,
      required: true
    },
    abbrev: {
      type: String,
      required: true
    },
    tradeOpenIndex: {
      type: Number,
      required: true
    },
    tradeCloseIndex: {
      type: Number,
      required: true
    },
    buffer: {
      type: Number,
      required: false,
      default: 40
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
      return 'stochasticLineGraphForTrade'
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

      return { dataPoints: stochastics, details }
    }
  },

  methods: {
    uploadStochastics() {
      getStochasticsForTrade(this.prototypeNumber, this.interval, this.abbrev, this.tradeUUID, this.buffer)
        .then(res => {
          this.stochastics = res
        })
    },

    updateGraph() {
      clearLineGraph(this.domClassName)
      buildLineGraph(this.lineGraphData, this.domClassName, 1310, 350, 80)
    },

     addTradeOpenClassToGraph() {
      if (this.tradeOpenIndex < 0) return 

      const xGridTicks = document.querySelectorAll(".stochastic-line-graph .x-grid .tick");
      if (!xGridTicks) return
      if (xGridTicks.length < this.tradeOpenIndex) return

      xGridTicks[this.tradeOpenIndex].classList.add("trade-open")
    },

    addTradeCloseClassToGraph() {
      if (this.tradeCloseIndex < 0) return

      const xGridTicks = document.querySelectorAll(".stochastic-line-graph .x-grid .tick");
      if (!xGridTicks) return
      if (xGridTicks.length < this.tradeCloseIndex) return

      xGridTicks[this.tradeCloseIndex].classList.add("trade-close")
    },
  },

  watch: {
    lineGraphData() {
      this.updateGraph()
    },

    tradeOpenIndex() {
      this.addTradeOpenClassToGraph()
    },

    tradeCloseIndex() {
     this.addTradeCloseClassToGraph()
    },

    '$route.params.UUID' () {
      this.uploadStochastics()
    },
  }
}
</script>


<style lang="scss">
.tick.trade-open {
  text {
    fill: rgba(0,122,255,1.0);
    font-weight: bold;
  }
  line {
    stroke: rgba(0,122,255,1.0);
  }
}

.tick.trade-close {
  text {
    fill: rgba(215,46,61,1.0);
    font-weight: bold;
  }
  line {
    stroke: rgba(215,46,61,1.0);
  }
}
</style>