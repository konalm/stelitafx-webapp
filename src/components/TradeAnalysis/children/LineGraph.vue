<template>
  <div>
    <b-row class="mb-3">
      <b-col>
        <div id="tradeAnalysisLineGraph"></div>
      </b-col>
    </b-row>

    <b-row>
      <b-col class="d-flex flex-row-reverse"> 
        <b-button-group size="sm">
          <b-button v-on:click="adjustVerticalXTicks(10)"> 
            <i class="fas fa-plus"></i> 
          </b-button>

          <b-button v-on:click="adjustVerticalXTicks(-10)">
            <i class="fas fa-minus"></i> 
          </b-button>
        </b-button-group>
      </b-col>
    </b-row>
  </div>
</template>


<script>
import { buildLineGraph, clearLineGraph } from '@/graph/lineGraph';
import { compareHourAndMin } from '@/services/utils';

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

      const dataPoints = this.wmaData.map((dataPoint) => ({
        date: dataPoint.date,
        rate: dataPoint.rate,
        openRate: this.trade.openRate,
        closeRate: this.trade.closeRate,
        fiveWMA: dataPoint.WMAs["5"],
        twelveWMA: dataPoint.WMAs["12"],
        fifteenWMA: dataPoint.WMAs["15"],
        thirtySixWMA: dataPoint.WMAs["36"],
        twoHundredWMA: dataPoint.WMAs["200"]
      }));
      let details = [
        {
          key: 'rate',
          colour: 'black',
          width: 2,
        }, {
          key: 'openRate',
          colour: 'rgba(0, 122, 255, 1.0)',
          width: 1,
        }, {
          key: 'closeRate',
          colour: 'rgba(215, 46, 61, 1.0)',
          width: 1,
        }
      ];

      const protoNo = parseInt(this.protoNo);

      if (
        protoNo === 1 || 
        protoNo === 2 || 
        protoNo === 3 || 
        protoNo === 7 ||
        protoNo === 71 ||
        protoNo === 72 ||
        protoNo === 73 ||
        protoNo === 74 ||
        protoNo === 14 ||
        protoNo === 85
      ) {
        details = details.concat(this.wmaDetailsForProtoOneAndTwo)
      }

      if (protoNo === 5 || protoNo === 51) details = details.concat(this.wmaDetails5And15)
      if (protoNo === 4 || protoNo === 6) details = details.concat(this.wmaDetails5And12)


      return { dataPoints, details };
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
      
      clearLineGraph('tradeAnalysisLineGraph')
      buildLineGraph(
        this.formattedDataForLineGraph, 
        'tradeAnalysisLineGraph', 
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
