<template>
  <div class="app-list">
    <div class="list-containerOther">
      <div>
        <tabs-bar ref="tabs" @exportData="exportData" @uploadList="upload" @queryBtn="query"/>
      </div>
      <list ref="list" @uploadList="uploadPage"/>
    </div>
  </div>
</template>

<script>
import { TabsBar, List } from './components'

export default {
  components: {
    TabsBar,
    List
  },
  mounted() {
    this.$refs.list.fetchData(this.$refs.tabs.qFilter())
  },
  methods: {
    exportData() {
      this.$refs.list.ExportData()
    },
    upload() {
      this.$refs.list.uploadPr(this.$refs.tabs.qFilter())
    },
    uploadPage() {
      this.$refs.list.fetchData(this.$refs.tabs.qFilter())
    },
    query() {
      this.$refs.list.uploadPr(this.$refs.tabs.qFilter())
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
