<template>
  <div class="list-header">
    <el-form v-model="search" :size="'mini'">
      <el-button-group style="float:right">
       <!-- <el-button v-for="(t,i) in btnList" :key="i" v-if="t.category == 'default'" :size="'mini'" type="primary"
                   :icon="t.cuicon" @click="onFun(t.path)">{{t.menuName}}
        </el-button>-->
        <!--@click="printer"-->
        <el-button :size="'mini'" type="primary" icon="el-icon-plus" @click="handlerAdd">新增</el-button>
        <el-button :size="'mini'" type="primary" icon="el-icon-edit" @click="handlerAlter">修改</el-button>
        <el-button :size="'mini'" type="primary" icon="el-icon-delete" @click="del">删除</el-button>
        <el-button :size="'mini'" type="primary" icon="el-icon-error" @click="disable">禁用</el-button>
        <el-button :size="'mini'" type="primary" icon="el-icon-success" @click="enable">启用</el-button>
        <el-button :size="'mini'" type="primary" icon="el-icon-refresh" @click="upload">刷新</el-button>
      </el-button-group>
    </el-form>
  </div>
</template>

<script>import { mapGetters } from 'vuex'
import { getByUserAndPrId } from '@/api/system/index'
import { getToken } from '@/utils/auth'

export default {
  components: {
  },
  data() {
    return {
      btnList: [],
      headers: {
        'authorization': getToken('wcrx')
      },
      fileUrl: '',
      search: {
        name: '',
        type: 1
      }
    }
  },
  computed: {
    ...mapGetters(['node', 'clickData', 'selections'])
  },
  mounted() {
    /*this.fileUrl = `/baoli/inputData/inputProductMessage`*/
    /*this.fileUrl = `/baoli/inputData/input`
    let path = this.$route.meta.id
    getByUserAndPrId(path).then(res => {
      this.btnList = res.data
      this.$forceUpdate()
    })*/
  },
  methods: {
    // 导出
    exportData() {
      this.$emit('exportData')
    },
    // 查询条件过滤
    qFilter() {
      let obj = {}
      this.search.cinemaName != null && this.search.cinemaName != '' ? obj.cinemaName = this.search.cinemaName : null
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
    upload() {
      this.$emit('uploadList')
    },
    disable() {
      if (this.clickData.eid) {
        this.clickData.disable = true
        alterClerk(this.clickData).then(res => {
          if(res.flag) {
            this.$emit('uploadList')
          }
        });
      } else {
        this.$message({
          message: '无选中行',
          type: 'warning'
        });
      }
    },
    enable() {
      if (this.clickData.eid) {
        this.clickData.disable = false
        alterClerk(this.clickData).then(res => {
          if(res.flag){
            this.$emit('uploadList')
          }
        })
      } else {
        this.$message({
          message: '无选中行',
          type: 'warning'
        });
      }
    },
    del() {
      if (this.clickData.fid) {
        this.$confirm('是否删除，删除后将无法恢复?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('del', {fid: this.clickData.fid})
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
      if (this.clickData.fid) {
        this.$emit('showDialog', this.clickData)
      } else {
        this.$message({
          message: '无选中行',
          type: 'warning'
        })
      }
    },
  }
}
</script>

<style>
</style>
