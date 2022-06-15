<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins
export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    console.log(this.chartdata)
    this.renderChart(this.chartdata, this.options)
  }
}
</script>