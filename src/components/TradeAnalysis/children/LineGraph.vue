<template>
  <div>
    <b-row class="mb-3">
      <b-col>
        <div :id="domId"></div>
      </b-col>
    </b-row>

    <b-row>
      <b-col class="d-flex flex-row-reverse"> 
        <b-button-group size="sm">
          <b-button v-on:click="adjustVerticalXTicks(40)"> 
            <i class="fas fa-plus"></i> 
          </b-button>

          <b-button v-on:click="adjustVerticalXTicks(-40)">
            <i class="fas fa-minus"></i> 
          </b-button>
        </b-button-group>
      </b-col>
    </b-row>
  </div>
</template>


<script>
const numToWords = require('number-to-words');
import { buildLineGraph, clearLineGraph } from '@/graph/lineGraph';
import { compareHourAndMin } from '@/services/utils';
import wmaSettings from '@/settings/wma';


export default {
  props: {
    trade: {
      type: Object,
      required: true
    },

    wmaData: {
      type: Array,
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

    protoNo: {
      type: Number,
      required: true
    },

    domId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      verticalXTicks: 50
    }
  },

  computed: {
    formattedDataForLineGraph() {
      if (!this.wmaData.length) return 
      if (!this.trade) return

      const protoWmaSettings = wmaSettings.find((x) => x.protoNo === this.protoNo)
      const wmas = protoWmaSettings ? protoWmaSettings.wmas : null

      const dataPoints = []
      this.wmaData.forEach((x) => {
        let dataPoint = {
          date: x.date,
          rate: x.rate,
          openRate: this.trade.openRate,
          closeRate: this.trade.closeRate,
        }

        if (wmas) wmas.forEach((y) => dataPoint[y] = x.WMAs[`${y}`])
        dataPoints.push(dataPoint)
      })

      const details = [
        {
          key: 'rate',
          colour: 'black',
          width: 2,
        }, 
        // {
        //   key: 'openRate',
        //   colour: 'rgba(0, 122, 255, 1.0)',
        //   width: 1,
        // }, 
        // {
        //   key: 'closeRate',
        //   colour: 'rgba(215, 46, 61, 1.0)',
        //   width: 1,
        // }
      ];

      if (wmas) {
        wmas.forEach((x, i) => {
          let colour = 'blue' 
          if (i > 0)  colour = 'red'
          else colour = 'green'

          details.push({
            key: x,
            colour,
            width: 1
          })
        })
      }

      return { dataPoints, details };
    },

    wma200() {
      return [
        {
          key: 'twoHundredWMA',
          colour: 'green',
          width: 2
        }
      ]
    },

     wmaDetailsForProtoOneAndTwo() {
      return [
        {
          key: 'twelveWMA',
          colour: 'blue',
          width: 1
        },
        {
          key: 'thirtySixWMA',
          colour: 'red',
          width: 1
        }
      ];
    },

    wmaDetails5And15() {
      return [
        {
          key: 'fiveWMA',
          colour: 'blue',
          width: 1
        },
        {
          key: 'fifteenWMA',
          colour: 'red',
          width: 1
        }
      ]
    },

    wmaDetails5And12() {
      return [
        {
          key: 'fiveWMA',
          colour: 'blue',
          width: 1
        },
        {
          key: 'twelveWMA',
          colour: 'red',
          width: 1
        }
      ]
    },

    wmaDetails200() {
      return [
        {
          key: 'twoHundredWMA',
          colour: 'green',
          width: 200
        }
      ]
    },

  },

  methods: {
    adjustVerticalXTicks(amount) {
      this.verticalXTicks += amount
      if (this.verticalXTicks < 0) this.verticalXTicks = 0
    },

    addTradeOpenClassToWMAGraph() {
      if (this.tradeOpenIndex < 0) return 

      const xGridTicks = document.querySelectorAll(".x-grid .tick");
      if (!xGridTicks) return
      if (xGridTicks.length < this.tradeOpenIndex) return

      xGridTicks[this.tradeOpenIndex].classList.add("trade-open")
    },

    addTradeCloseClassToWMAGraph() {
      if (this.tradeCloseIndex < 0) return

      const xGridTicks = document.querySelectorAll(".x-grid .tick");
      if (!xGridTicks) return
      if (xGridTicks.length < this.tradeCloseIndex) return

      xGridTicks[this.tradeCloseIndex].classList.add("trade-close")
    },

    updateLineGraph() {
      if (!this.formattedDataForLineGraph) return
      
      clearLineGraph(this.domId)
      buildLineGraph(
        this.formattedDataForLineGraph, 
        this.domId, 
        1310, 
        500, 
        this.verticalXTicks
      )
      this.addTradeOpenClassToWMAGraph()
      this.addTradeCloseClassToWMAGraph()
    }
  },

  watch: {
    formattedDataForLineGraph(value) {
      this.updateLineGraph()
    },

    tradeOpenIndex() {
      this.addTradeOpenClassToWMAGraph()
    },

    tradeCloseIndex() {
     this.addTradeCloseClassToWMAGraph()
    },

    verticalXTicks() {
      this.updateLineGraph()
    }
  }
}
</script>
