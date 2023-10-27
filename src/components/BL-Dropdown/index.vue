<script>
import { Dropdown } from 'element-ui'
export default {
  name: 'BLDropdown',
  extends: Dropdown,
  methods: {
    handleMenuItemClick(command, instance) {
      if (this.hideOnClick) {
        clearTimeout(this.timeout)
        this.visible = false
      }
      this.$emit('command', command, instance)
    }
  }
}
</script>
