<template>
  <div class="list-header">
    <el-form v-model="search" :size="'mini'" :label-width="'80px'">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-form-item :label="'产品名称'">
            <el-input v-model="search.itemName" placeholder="产品名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item :label="'交工序名称'">
            <el-input v-model="search.sendProcessName" placeholder="交工序名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item :label="'部件名称'">
            <el-input v-model="search.departName" placeholder="部件名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item :label="'工程地址'">
            <el-input v-model="search.workSiteAddr" placeholder="工程地址"/>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button :size="'mini'" type="primary" icon="el-icon-search" @click="query">查询</el-button>
        </el-col>
        <el-button-group style="float:right">
          <!-- <el-button v-for="(t,i) in btnList" :key="i" v-if="t.category == 'default'" :size="'mini'" type="primary" :icon="t.cuicon" @click="onFun(t.path)">{{t.menuName}}</el-button>-->
          <!-- <el-button :size="'mini'" type="primary" icon="el-icon-plus" @click="handlerAdd">新增</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-edit" @click="handlerAlter">修改</el-button>
         <el-button :size="'mini'" type="primary" icon="el-icon-delete" @click="Delivery">删除</el-button>-->
          <el-button :size="'mini'" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-refresh"    @click="upload">刷新</el-button>
        </el-button-group>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-form-item :label="'交货日期'">
            <el-input v-model="search.planDeliveryDate" placeholder="预计交货日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="display: inline-block">
          <el-form-item :label="'日期'">
            <el-date-picker
              v-model="value"
              type="datetimerange"
              style="width: auto"
              align="right"
              class="input-class"
              unlink-panels
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import { mapGetters } from "vuex";
  export default {
    components: {},
    computed: {
      ...mapGetters(["node","clickData","selections"])
    },
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value: '',
        btnList: [],
        search: {
          itemName: null,
          sendProcessName: null,
          departName: null,
          workSiteAddr: null,
          planDeliveryDate: null,
        }
      };
    },
    mounted() {

      let path = this.$route.meta.id
      /*   getByUserAndPrId(path).then(res => {
           this.btnList = res.data
           this.$forceUpdate();
         });*/
    },
    methods: {
      changeType(val){
        this.search.type = val
        this.$emit('queryBtn', this.qFilter())
      },
      onFun(method){
        this[method]()
      },
      // 查询条件过滤
      qFilter() {
        let obj = {}
        this.search.itemName != null && this.search.itemName != '' ? obj.itemName = this.search.itemName : null
        this.search.sendProcessName != null && this.search.sendProcessName != '' ? obj.sendProcessName = this.search.sendProcessName : null
        this.search.departName != null && this.search.departName != '' ? obj.departName = this.search.departName : null
        this.search.workSiteAddr != null && this.search.workSiteAddr != '' ? obj.workSiteAddr = this.search.workSiteAddr : null
        this.search.planDeliveryDate != null && this.search.planDeliveryDate != '' ? obj.planDeliveryDate = this.search.planDeliveryDate : null
        this.value != null && this.value != undefined ? obj.endDate = this.value[1] : null
        this.value != null && this.value != undefined ? obj.startDate = this.value[0] : null
        return obj
      },
      // 关键字查询
      // 关键字查询
      query() {
        this.$emit('queryBtn', this.qFilter())
      },
      // 导出
      exportData() {
        this.$emit('exportData')
      },
      upload() {
        this.search.itemName = ''
        this.search.sendProcessName = ''
        this.search.departName = ''
        this.search.workSiteAddr = ''
        this.search.planDeliveryDate = ''
        this.value = ''
        this.$emit('uploadList')
      },
    }
  };
</script>

<style>
</style>
