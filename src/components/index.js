import BLTable from '@/components/BL-Table'
import ExTableColumn from '@/components/BL-Table/exTableColumn'
import BLDropdown from '@/components/BL-Dropdown'
import BLInputNumber from '@/components/BL-Input-Number'

export default {
  install(Vue) {
    Vue.component('BLTable', BLTable)
    Vue.component('ExTableColumn', ExTableColumn)
    Vue.component('BLDropdown', BLDropdown)
    Vue.component('BLInputNumber', BLInputNumber)
  }
}
