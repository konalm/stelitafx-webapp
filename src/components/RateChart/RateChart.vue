<template>
  <app-template>
    <b-row>
      <b-col>
        <chart :currency="'GBP'" :timeInterval="15" :rates="true" />
      </b-col>
    </b-row>
    
  </app-template>
</template>

<script>
import AppTemplate from '@/components/patterns/AppTemplate';
import Chart from '@/components/patterns/Chart';

export default {
  components: {
    AppTemplate,
    Chart
  },

  data() {
    return {
      AppTemplate
    }
  }

}
</script>

<style>

</style>