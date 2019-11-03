<template>
  <div class="row__container d-flex">
    {{ name }} <b-form-checkbox v-model="show" class="ml-2"  />

    <!-- Weight -->
    <span class="ml-2 d-flex" v-if="show">
      weight: <b-form-input class="weight-input ml-2" v-model.number="weight" readonly />
      <b-button class="ml-1" v-on:click="incWeight()"> 
        <i class="fas fa-plus"></i> 
      </b-button> 

      <b-button class="ml-1" v-on:click="decWeight()"> 
        <i class="fas fa-minus"></i> 
      </b-button> 
    </span>

    <!-- Colour -->
    <span class="ml-4 d-flex position-relative" v-if="show">
      Colour:
      <div class="colour__sample mx-1" v-bind:style="{background: lineColour}"> </div>

      <b-button v-on:click="togglePickColour()"> 
        {{ pickColourButtonText }}
      </b-button>

      <chrome-picker v-if="pickColour" v-model="colours" class="colour-picker" />
    </span>
  </div>
</template>

<script>
import { Chrome } from 'vue-color'
import numberToWord from 'num-words'

export default {
  components: {
    'chrome-picker': Chrome
  },

  props: {
    value: {
      type: Object,
      required: false,
      default: {
        length: 0,
        colour: '',
        show: false,
        weight: Number
      },
    },
  },

  data() {
    return {
      colours : {
        hex: '#194d33',
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1
      },
      pickColour: false,
      lineColour: '',
      weight: 1,
      show: true
    }
  },

  beforeMount() {
    this.lineColour = this.colours.hex
  },

  computed: {
    pickColourButtonText() {
      if (!this.pickColour) return 'Update'
      return 'Done'
    },

    name() {
      return parseInt(this.value.length) === 0 
        ? 'Current Rate' 
        : `${this.value.length} WMA`
    }
  },

  methods: {
    togglePickColour() {
      this.pickColour = !this.pickColour
    },

    incWeight() { this.weight ++ },

    decWeight() {
      if (this.weight > 0) this.weight --
    },

    emitChanges() {
      const lengthAsWord = numberToWord(this.value.length)
      let formattedLengthAsWord = lengthAsWord.replace(/(\w+)(?:\s+|$)/g, (_, word) => 
        word.charAt(0).toUpperCase() + word.substr(1)
      )
      formattedLengthAsWord = formattedLengthAsWord.charAt(0).toLowerCase() + 
        formattedLengthAsWord.slice(1)

      const payload = {
        length: this.value.length,
        lengthAsString: this.value.length === 0 ? 'rate' : `${formattedLengthAsWord}WMA`,
        show: this.show,
        colour: this.lineColour,
        weight: this.weight
      }

      this.$emit('input', payload)
    }
  },

  watch: {
    colours() { this.lineColour = this.colours.hex },

    lineColour() { this.emitChanges() },

    weight() { this.emitChanges() },

    show() { this.emitChanges() },

    value: {
      immediate: true,
      deep: true,
      handler: function(value) {
        if (value.hasOwnProperty('show')) this.show = value.show
        if (value.hasOwnProperty('colour')) this.lineColour = value.colour
        if (value.hasOwnProperty('weight')) this.weight = value.weight
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.row__container {
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding: 5px 0;
  font-size: 12px;
}

input {
  padding: 0 10px;
  height: 25px;
}

button {
  height: 25px;
  padding: 0 10px;
  font-size: 12px;
}

.weight-input {
  width: 50px;
}

.colour__sample {
  width: 25px;
  height: 25px;
}

.colour-picker {
  position: absolute;
  top: 40px;
  left: 40px;
  z-index: 10;
}
</style>