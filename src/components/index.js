import BLTable from '@/components/BL-Table'
import ExTableColumn from '@/components/BL-Table/exTableColumn'

export default {
  install(Vue) {
    Vue.component('BLTable', BLTable)
    Vue.component('ExTableColumn', ExTableColumn)
  }
}
