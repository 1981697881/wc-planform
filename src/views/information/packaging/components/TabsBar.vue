<template>
  <div class="list-header">
    <el-form v-model="search" :size="'mini'" :label-width="'80px'">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-form-item :label="'订单号'">
            <el-input v-model="search.orderNo" placeholder="订单号"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item :label="'客户名称'">
            <el-input v-model="search.custName" placeholder="客户名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="display: inline-block">
          <el-form-item :label="'日期'">
            <el-date-picker
              v-model="value"
              type="daterange"
              style="width: auto"
              align="right"
              class="input-class"
              unlink-panels
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button :size="'mini'" type="primary" icon="el-icon-search" @click="query">查询</el-button>
        </el-col>
        <el-button-group style="float:right">
          <el-button v-for="(t,i) in btnList" :key="i" v-if="t.category == 'default'" :size="'mini'" type="primary"
                     :icon="t.cuicon" @click="onFun(t.path)">{{t.menuName}}
          </el-button>
          <!--@click="printer"-->
          <!--<el-button :size="'mini'" type="primary" icon="el-icon-plus" @click="handlerAdd">新增</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-edit" @click="handlerAlter">修改</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-printer" @click="printOrderTable">单据打印</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-printer" @click="printLabel">明细打印</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-delete" @click="del">删除</el-button>-->
          <el-button :size="'mini'" type="primary" icon="el-icon-refresh" @click="upload">刷新</el-button>
        </el-button-group>
      </el-row>
    </el-form>
  </div>
</template>

<script>import {mapGetters} from 'vuex'
import {getByUserAndPrId} from '@/api/system/index'
import {getToken} from '@/utils/auth'

export default {
  components: {},
  data() {
    return {
      btnList: [],
      headers: {
        'authorization': getToken('wcrx')
      },
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
      fileUrl: '',
      search: {
        custName: '',
        orderNo: ''
      }
    }
  },
  computed: {
    ...mapGetters(['node', 'clickData', 'selections'])
  },
  mounted() {
    let path = this.$route.meta.id
    getByUserAndPrId(path).then(res => {
      this.btnList = res.data
      this.$forceUpdate()
    })
  },
  methods: {
    // 关键字查询
    query() {
      this.$emit('queryBtn', this.qFilter())
    },
    // 导出
    exportData() {
      this.$emit('exportData')
    },
    // 查询条件过滤
    qFilter() {
      let obj = {}
      this.search.custName != null && this.search.custName != '' ? obj.custName = this.search.custName : null
      this.search.orderNo != null && this.search.orderNo != '' ? obj.orderNo = this.search.orderNo : null
      this.value != null && this.value != undefined ? obj.dateE = this.value[1] : null
      this.value != null && this.value != undefined ? obj.dateS = this.value[0] : null
      return obj
    },
    onFun(methodStr, event) {
      // 匹配 "methodName(param1,param2,...)" 格式
      const match = methodStr.match(/^(\w+)\((.*)\)$/);
      if (match) {
        const methodName = match[1];
        const argsString = match[2];
        // 将参数解析为数组（按逗号分割，简单处理数字/布尔/字符串）
        let args = argsString ? argsString.split(',').map(arg => arg.trim()) : [];
        args = args.map(arg => {
          // 尝试转换为数字
          const num = Number(arg);
          if (!isNaN(num)) return num;
          // 尝试转换布尔
          if (arg === 'true') return true;
          if (arg === 'false') return false;
          // 去掉可能的引号（单引号或双引号）
          if ((arg.startsWith("'") && arg.endsWith("'")) || (arg.startsWith('"') && arg.endsWith('"')))
            return arg.slice(1, -1);
          return arg;
        });
        // 调用方法，将解析的参数和事件一起传递（事件可选，放在最后）
        this[methodName](...args, event);
      } else {
        // 普通方法名：直接调用，传入事件
        this[methodStr](event);
      }
    },
    handlerAdd() {
      this.$emit('showDialog')
    },
    handlerInventory() {
      /*this.$emit('showInventory')*/
      if (this.clickData.fid) {
        this.$emit('showInventory', this.clickData)
      } else {
        this.$message({
          message: '无选中行',
          type: 'warning'
        })
      }
    },
    upload() {
      this.search.custName = ''
      this.search.orderNo = ''
      this.value = ''
      this.$emit('uploadList')
    },
    del() {
      if (this.clickData.id) {
        this.$confirm('是否删除，删除后将无法恢复?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('del', {id: this.clickData.id})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          message: '无选中行',
          type: 'warning'
        })
      }
    },
    handlerAlter() {
      if (this.clickData.id) {
        this.$emit('showDialog', this.clickData)
      } else {
        this.$message({
          message: '无选中行',
          type: 'warning'
        })
      }
    },
    handlerView() {
      if (this.clickData.id) {
        this.$emit('showViewDialog', this.clickData)
      } else {
        this.$message({
          message: '无选中行',
          type: 'warning'
        })
      }
    },
    printOrderTable() {
      this.$emit('printOrderTable', this.clickData)
    },
    printLabel() {
      this.$emit('printLabel', this.clickData)
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    uploadError(res) {
      this.$message({
        message: res.msg,
        type: 'warning'
      })
      this.$emit('uploadList')
    },
    uploadSuccess(res) {
      if (res.flag) {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.$emit('uploadList')
        this.$refs.upload.clearFiles()
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    },
    handleUpload(file, fileList) {
      if (file.status == 'ready') {
        this.submitUpload()
      }
    },
  }
}
</script>

<style>
  .upload-demo {
    float: right;
  }
</style>
