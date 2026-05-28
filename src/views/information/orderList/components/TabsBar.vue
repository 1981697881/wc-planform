<template>
  <div class="list-header">
    <el-form v-model="search" :size="'mini'" :label-width="'80px'">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-form-item :label="'母单号'">
            <el-input v-model="search.poNo" placeholder="母单号"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item :label="'子单号'">
            <el-input v-model="search.subPoNo" placeholder="子单号"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item :label="'客户名称'">
            <el-input v-model="search.custName" placeholder="客户名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button :size="'mini'" type="primary" icon="el-icon-search" @click="query">查询</el-button>
        </el-col>
        <el-button-group style="float:right">
          <!--@click="printer"-->
          <!-- <el-button :size="'mini'" type="primary" icon="el-icon-plus" @click="handlerAdd">新增</el-button>
           <el-button :size="'mini'" type="primary" icon="el-icon-edit" @click="handlerAlter">修改</el-button>
           <el-button :size="'mini'" type="primary" icon="el-icon-edit" @click="handlerInventory">物料清单</el-button>
           <el-button :size="'mini'" type="primary" icon="el-icon-delete" @click="del">删除</el-button>
           <el-upload
             name="tExpenseDetails"
             :on-success="uploadSuccess"
             :on-error="uploadError"
             accept="xlsx,xls"
             ref="upload"
             :headers="headers"
             :show-file-list="false"
             :action="fileUrl"
             class="upload-demo"
             multiple
             :auto-upload="false"
             :on-change="handleUpload"
             :limit="1"
           >
             <el-button size="mini" type="primary" icon="el-icon-upload2">导入</el-button>
             <el-button style="margin-left: 10px;display: none" size="mini" type="success" @click="submitUpload">上传到服务器
             </el-button>
           </el-upload>-->
          <el-button v-for="(t,i) in btnList" :key="i" v-if="t.category == 'default'" :size="'mini'" type="primary"
                     :icon="t.cuicon" @click="onFun(t.path)">{{t.menuName}}
          </el-button>
          <el-upload
            name="order"
            :on-success="uploadSuccess"
            :on-error="uploadError"

            accept="xlsx,xls"
            ref="upload"
            :headers="headers"
            :show-file-list="false"
            action="web/excel/import/goodsMMStock"
            class="upload-demo"
            multiple
            :auto-upload="false"
            :on-change="handleUpload"
            :limit="3"
          >
            <el-button v-for="(t,i) in btnList" :key="i" v-if="t.category == 'import'" size="mini" type="primary"
                       icon="el-icon-upload2">导入
            </el-button>
            <el-button style="margin-left: 10px;display: none" size="mini" type="success" @click="submitUpload">上传到服务器
            </el-button>
          </el-upload>
          <el-button :size="'mini'" type="primary" icon="el-icon-refresh" @click="upload">刷新</el-button>
        </el-button-group>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-form-item :label="'销售地'">
            <el-select style="width: 100%" v-model="search.saleOrgin" placeholder="请选择">
              <el-option
                v-for="(item,index) in saleOrginList"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item :label="'合同状态'">
            <el-radio-group v-model="search.poStatus">
              <el-radio label="发齐">发齐</el-radio>
              <el-radio label="未发齐">未发齐</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="5" style="display: inline-block">
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
      fileUrl: '',
      saleOrginList: [
        {label: '经销商', value: '经销商'},
        {label: '深圳', value: '深圳'},
        {label: '工厂', value: '工厂'},
        {label: '广州', value: '广州'},
      ],
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
      search: {
        custName: '',
        poNo: '',
        subPoNo: '',
        saleOrgin: '',
        poStatus: '',
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
      this.search.saleOrgin != null && this.search.saleOrgin != '' ? obj.saleOrgin = this.search.saleOrgin : null
      this.search.poStatus != null && this.search.poStatus != '' ? obj.poStatus = this.search.poStatus : null
      this.search.poNo != null && this.search.poNo != '' ? obj.poNo = this.search.poNo : null
      this.search.subPoNo != null && this.search.subPoNo != '' ? obj.subPoNo = this.search.subPoNo : null
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
      if (this.clickData.id) {
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
      this.search.poStatus = ''
      this.search.saleOrgin = ''
      this.search.poNo = ''
      this.search.subPoNo = ''
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
