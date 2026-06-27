<template>
  <div>
    <list
      class="list-main box-shadow"
      :columns="columns"
      :loading="loading"
      :list="list"
      index
      @handle-size="handleSize"
      @handle-current="handleCurrent"
      @row-click="rowClick"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import List from '@/components/List'
import { poDeliveryReport } from '@/api/reportForm/index'

export default {
  components: {
    List
  },
  computed: {
    ...mapGetters(['node'])
  },
  data() {
    return {
      loading: false,
      list: {},
      columns: [
        { text: '客户代码', name: 'custNumber', width: '100px' },
        { text: '客户名称', name: 'custName'},
        { text: '工程地址', name: 'workSiteAddr', width: '150px' },
        { text: '母订单号', name: 'poNo'},
        { text: '子订单号', name: 'poSubNo'},
        { text: '产品位置', name: 'productPosition'},
        { text: '产品明细(部件名称)', name: 'itemName', width: '180px' },
        { text: '箱号', name: 'boxNo'},
        { text: '发货时间', name: 'sendDate', width: '110px' }
      ]
    }
  },
  methods: {
    ExportData() {
      import('@/vendor/Export2Excel').then(excel => {
        const columns = this.columns
        const tHeader = []
        const filterVal = []
        columns.forEach(item => {
          tHeader.push(item.text)
          filterVal.push(item.name)
        })
        const list = this.list.records || []
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel(tHeader, data, '订单交付情况')
      })
    },
    formatJson(filter, jsonDate) {
      return jsonDate.map(v =>
        filter.map(j => v[j])
      )
    },
    handleSize(val) {
      this.list.size = val
      this.$emit('uploadList')
    },
    handleCurrent(val) {
      this.list.current = val
      this.$emit('uploadList')
    },
    rowClick(obj) {
      this.$store.dispatch('list/setClickData', obj.row)
    },
    uploadPr(val) {
      this.fetchData(val, {
        pageNum: 1,
        pageSize: this.list.size || 50
      })
    },
    fetchData(val, data = {
      pageNum: this.list.current || 1,
      pageSize: this.list.size || 50
    }) {
      this.loading = true
      poDeliveryReport(data, val).then(res => {
        this.loading = false
        if (res.flag) {
          this.list = res.data || {}
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.list-main {
  height: calc(100vh - 250px);
}
</style>
