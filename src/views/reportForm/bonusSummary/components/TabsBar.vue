<template>
  <div class="list-header">
    <el-form v-model="search" :size="'mini'">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-form-item :label="''">
            <el-date-picker
              size="mini"
              style="width: 100%"
              type="month"
              value-format="yyyy-MM"
              v-model="search.fannual"
              placeholder="年月">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item :label="''">
            <el-select
              size="mini"
              filterable
              remote
              :remote-method="remoteMethod"
              :loading="loading"
              v-model="search.fteamname"
              style="width: 100%"
              search.name
              placeholder="团队">
              <el-option
                v-for="item in teamList"
                :key="item.fid"
                :label="item.fteamname"
                :value="item.fteamname">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button :size="'mini'" type="primary" icon="el-icon-search" @click="query">查询</el-button>
        </el-col>
        <el-button-group style="float:right">
          <!--<el-button v-for="(t,i) in btnList" :key="i" v-if="t.category == 'default'" :size="'mini'" type="primary" :icon="t.cuicon" @click="onFun(t.path)">{{t.menuName}}</el-button>-->
          <el-button :size="'mini'" type="primary" icon="el-icon-plus" @click="handlerAdd">新增</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-edit" @click="handlerAlter">修改</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-delete" @click="Delivery">删除</el-button>
          <!--<el-button :size="'mini'" type="primary" icon="el-icon-error" @click="disable" >禁用</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-success" @click="enable" >启用</el-button>-->
          <el-button :size="'mini'" type="primary" icon="el-icon-refresh" @click="upload">刷新</el-button>
        </el-button-group>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { alterClerk } from '@/api/basic/index'
import { getByUserAndPrId } from '@/api/system/index'
import { getTteamList} from '@/api/information/index'
export default {
  components: {},
  computed: {
    ...mapGetters(['node','clickData','selections'])
  },
  data() {
    return {
      btnList: [],
      loading: false,
      teamList: [],
      search: {
        fannual: null,
        fteamname: null,
      }
    };
  },
  mounted() {
    this.getTeamArray();
    /*let path = this.$route.meta.id
    getByUserAndPrId(path).then(res => {
      this.btnList = res.data
      this.$forceUpdate();
    });*/
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.getTeamArray({fteamname: query});
      } else {
        this.teamList = [];
      }
    },
    getTeamArray(val = {}, data = {
      pageNum: 1,
      pageSize: 10
    }) {
      getTteamList(data, val).then(res => {
        if (res.flag) {
          this.loading = false;
          this.teamList = res.data.records
        }
      });
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
    Delivery() {
      if (this.clickData.id) {
        this.$confirm('是否删除（' + this.clickData.name + '），删除后将无法恢复?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('delList', [{
            id: this.clickData.id
          }])
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
    query() {
      this.$emit('queryBtn', this.qFilter())
    },
    upload() {
      this.search.name = ''
      this.$emit('uploadList')
    },
    // 查询条件过滤
    qFilter() {
      let obj = {}
      this.search.name != null && this.search.name != '' ? obj.companyName = this.search.name : null
      return obj
    },
    handlerAdd(){
      this.$emit('showDialog')
    }
  }
};
</script>

<style>
</style>
