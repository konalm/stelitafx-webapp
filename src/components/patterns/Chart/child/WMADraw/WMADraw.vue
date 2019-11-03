<template>
  <b-card class="mb-2">
    <section v-if="newWMADraw" class="border border-info p-2 rounded">
      <b-row>
        <b-col>
          <b-button variant="primary" class="my-2" v-on:click="setShowCreateModal()"> 
            Create 
          </b-button>
        </b-col>

        <b-col class="text-right">
          <b-button class="bg-danger" v-on:click="newWMADraw = false">
            <i class="fa fa-times" aria-hidden="true"></i>
          </b-button>
        </b-col>
      </b-row>
      
      <b-row>
        <b-col>
          <b-form-select class="my-2" v-model="selected" :options="options" />
        </b-col>
      </b-row>
    </section>

    <b-button v-else v-on:click="toggleNewWMADraw()"> New WMA draw </b-button>
    
    <section v-if="selected" class="mt-2">
      <wma-length v-for="(wmaDataItem, index) in wmaData"
        v-model="wmaData[index]"
        :key="wmaDataItem.length" 
      />

      <b-button class="mt-2" v-on:click="updateWMAOptionItem()"> Save </b-button>
    </section>

    <create-modal :show="showCreateModal" v-on:hide="hideCreateModal" />
  </b-card>
</template>


<script>
import { 
  getChartingWMAOptions, getChartingWMAOptionItem, updateChartingWMAOptionItem
} from '@/http/charting'
import WmaLength from './child/WMALength';
import CreateModal from './child/Create';

const defaultWMAItemDraw = {
  show: true,
  colour: '#111111',
  weight: 3
}

export default {
  components: {
    WmaLength,
    CreateModal
  },

  data() {
    return {
      newWMADraw: false,
      rateDataPoint: {},
      wmaData: [
        {
          length: 0,
          lengthAsString: "rate",
          ...defaultWMAItemDraw
        },
        { 
          length: 5, 
          lengthAsString: "fiveWMA", 
          ...defaultWMAItemDraw
        },
        {
          length: 12, 
          lengthAsString: "twelveWMA", 
          ...defaultWMAItemDraw
        }, 
        {
          length: 15, 
          lengthAsString: "fifteenWMA", 
          ...defaultWMAItemDraw
        }, 
        { 
          length: 36, 
          lengthAsString: "thirtySixWMA", 
          ...defaultWMAItemDraw
        }, 
        {
           length: 200, 
           lengthAsString: "twoHundredWMA", 
           ...defaultWMAItemDraw
        } 
      ],
      selected: '',
      options: [],
      showCreateModal: false
    }
  },

  beforeMount() {
    this.uploadChartingWMAOptions()
  },

  methods: {
    toggleNewWMADraw() {
      this.newWMADraw = !this.newWMADraw
    },

    setShowCreateModal() {
      this.showCreateModal = true  
    },

    hideCreateModal() {
      this.showCreateModal = false
    },

    uploadChartingWMAOptions() {
      getChartingWMAOptions()
        .then(res => {
          this.options = res.map(x => ({
            text: x.description,
            value: x.uuid
          }))
          this.selected = this.options[0].value
        })
    },

    uploadChartWMAOptionItem() {
      getChartingWMAOptionItem(this.selected)
        .then(res => {
          this.parseChartWMAToOptionsJson(res.optionsJSON)
        })
    },

    updateWMAOptionItem() {
      const payload = {
        jsonPayload: JSON.stringify(this.wmaData),
      }
      updateChartingWMAOptionItem(this.selected, payload)
    },

    parseChartWMAToOptionsJson(json) {
      if (!json) return

      const wmaOptions = JSON.parse(json)
      if (!wmaOptions.length) return
    
      wmaOptions.forEach((item) => {
        if (!item.hasOwnProperty('length')) return 

        const option = {
          show: item.hasOwnProperty('show') ? item.show : defaultWMAItemDraw.show,
          colour: item.hasOwnProperty('colour') ? item.colour : defaultWMAItemDraw.colour,
          weight: item.hasOwnProperty('weight') ? item.weight : defaultWMAItemDraw.weight
        }

        const i = this.wmaData.findIndex(x => x.length === item.length)
        if (i < 0) return

        Object.assign(this.wmaData[i], option)
      })
    }
  },

  watch: {
    selected() {
      this.uploadChartWMAOptionItem()
    },

    wmaData: {
      immediate: true,
      deep: true,
      handler: function(value) {
        this.$emit('input', value)
      }
    }
  },
}
</script>


<style lang="scss" scoped>
select {
  height: 25px;
  padding: 5px;
  font-size: 12px;
}

input {
  height: 30px;
}

button {
  font-size: 12px;
  height: 25px;
  padding: 0 10px;
}

</style>