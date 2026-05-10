<template>
  <div>
    <list
       class="list-main box-shadow"
      :columns="columns"
      :loading="loading"
      :list="list"
      index
      type
      @handle-size="handleSize"
      @handle-current="handleCurrent"
       @row-click="rowClick"
    />

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import List from "@/components/List";
import { poReport } from '@/api/reportForm/index'
export default {
  components: {
    List
  },
  computed: {
    ...mapGetters(["node"])
  },
  data() {
    return {
      loading: false,
      list: {},
      columns: [
        { text: "订单日期", name: "orderDate" },
        { text: "订单号", name: "poNo" },
        { text: "子订单号", name: "poSubNo" },
        { text: "产品编码", name: "itemNumber" },
        { text: "产品名称", name: "itemName" },
        { text: "产品规格", name: "itemSpec"},
        { text: "产品数量", name: "prodQty"},
        { text: "开工日期", name: "startDate"},
        { text: "总装日期", name: "assemblyDate"},
        { text: "总装图片", name: "faPhotoFiles", default: 'images'},
        { text: "打包日期", name: "packageDate"},
        { text: "包数", name: "prodQty"},
        { text: "包装箱号", name: "boxNo"},
        { text: "发货日期", name: "sendOutDate"},
        { text: "发货图片", name: "soPhotoFiles", default: 'images'},
        { text: "发货包数", name: "sendOutPackageQty"},
        { text: "物流单号", name: "expressNo"},
        { text: "总装备注", name: "faNote"},
        { text: "发货备注", name: "sendNote"},
      ]
    };
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
        excel.export_json_to_excel(tHeader,data,'订单完成情况报表')
      })
    },
    formatJson(filter, jsonDate){
      return jsonDate.map(v =>
        filter.map(j => {
          return v[j]
        })
      )
    },
      //监听每页显示几条
      handleSize(val) {
          this.list.size = val
        this.$emit('uploadList')
      },
      //监听当前页
      handleCurrent(val) {
          this.list.current = val
        this.$emit('uploadList')
      },
   /* dblclick(obj) {
      this.$emit('showDialog', obj.row)
    },*/
    Delivery(val) {
      delSupplier(val).then(res => {
        if(res.flag){
          this.$store.dispatch("list/setClickData", '');
          this.fetchData();
        }
      });
    },
    //监听单击某一行
    rowClick(obj) {
      this.$store.dispatch("list/setClickData", obj.row);
    },
    uploadPr(val) {
      this.fetchData(val,{
        pageNum: 1,
        pageSize: this.list.size || 50
      })
    },
    fetchData(val, data = {
      pageNum: this.list.current || 1,
      pageSize: this.list.size || 50
    }) {
      this.loading = false
      poReport(data, val).then(res => {
        this.loading = false
        this.list = res.data
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.list-main {
  height: calc(100vh - 250px);
}
</style>
