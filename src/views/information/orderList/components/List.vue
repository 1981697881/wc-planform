<template>
  <div>
    <list
      class="list-main box-shadow"
      :columns="columns"
      :loading="loading"
      :list="list"
      ref="list"
      index
      @handle-size="handleSize"
      @handle-current="handleCurrent"
      @row-click="rowClick"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getProdOrderByPage, deleteProdOrder } from '@/api/information/index'
import List from '@/components/List'

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
      visible: false,
      list: {},
      fid: null,
      type: null,
      columns: [
        /*{ text: '订单日期', name: 'poDate' },*/
        { text: '销售地', name: 'saleOrgin' },
        { text: '五金单', name: 'wuJin' },
        { text: '母订单号', name: 'poNo' },
        { text: '子订单号', name: 'subPoNo' },
        { text: '客户代码', name: 'custCode' },
        { text: '客户名称', name: 'custName' },
        { text: '工地地址', name: 'workSiteAddr' },
        { text: '产品名称(简略)', name: 'prodShortName' },
        { text: '产品名称', name: 'productName' },
        { text: '材质', name: 'productTxture' },
        { text: '油漆工艺', name: 'productPaint' },
        { text: '下单日期', name: 'poDate' },
        { text: '预计交货日期', name: 'deliveryDate' },
        { text: '交货日期', name: 'orderDate' },
        { text: '客户要求时间', name: 'custReqDate' },
        { text: '页数', name: 'pageNo' },
        { text: '设计员', name: 'designer' },
        { text: '工序进度情况', name: 'processProgress' },
        { text: '发货地址', name: 'custAddr' },
        { text: '发货时间', name: 'sendDate' },
        { text: '发货单号', name: 'sendNo' },
        { text: '发货方式', name: 'sendWay' },
        { text: '合同状态', name: 'poStatus' },
        { text: '备注', name: 'note' },
       /* { text: '产品数量', name: 'prdQty' },
        { text: '合同状态', name: 'poStatus' },*/
      ]
    }
  },
  methods: {
    ExportData() {
      import('@/vendor/Export2Excel').then(excel => {
        // 表格的表头列表
        const columns = this.columns
        const tHeader = []
        // 与表头相对应的数据里边的字段
        const filterVal = []
        columns.forEach((item, index) => {
          tHeader.push(item.text)
          filterVal.push(item.name)
        })
        const list = this.list.records
        const data = this.formatJson(filterVal, list);
        // 这里还是使用export_json_to_excel方法比较好，方便操作数据
        excel.export_json_to_excel(tHeader,data,'订单清单管理')
      })
    },
    formatJson(filter, jsonDate){
      return jsonDate.map(v =>
        filter.map(j => {
          return v[j]
        })
      )
    },
    // 监听每页显示几条
    handleSize(val) {
      this.list.size = val
      this.$emit('uploadList')
    },
    // 监听当前页
    handleCurrent(val) {
      this.list.current = val
      this.$emit('uploadList')
    },
    Delivery(val) {
      deleteProdOrder(val).then(res => {
        if(res.flag) {
          this.$store.dispatch('list/setClickData', '');
          this.$emit('uploadList')
        }
      });
    },
    uploadPr(val) {
      this.$refs.list.$refs.list.setCurrentRow({});
      this.$store.dispatch('list/setClickData', {})
      this.fetchData(val, {
        pageNum: 1,
        pageSize: this.list.size || 50
      })
    },
    dblclick(obj) {
      this.$emit('showDialog', obj.row)
    },
    // 监听单击某一行
    rowClick(obj) {
      this.$store.dispatch('list/setClickData', obj.row)
    },
    fetchData(val, data = {
      pageNum: this.list.current || 1,
      pageSize: this.list.size || 50
    }) {
      this.loading = false
      getProdOrderByPage(data, val).then(res => {
        this.loading = false
        this.list = res.data
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
