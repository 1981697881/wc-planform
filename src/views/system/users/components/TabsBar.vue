<template>
  <div class="list-header">
    <el-form v-model="search" :size="'mini'">
      <el-button-group style="float:right">
        <!--<el-dropdown v-for="(t,i) in btnList" :key="i" v-if="t.category == 'multi'" @command="onFun(t.path, $event)" trigger="click">
          <el-button :size="'mini'" type="primary">
            {{t.menuName}}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">用户组</el-dropdown-item>
            <el-dropdown-item command="2">用户</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->
        <!--<el-button :size="'mini'" type="primary" icon="el-icon-plus" @click="handlerBtn(2)">新增</el-button>
        <el-button :size="'mini'" type="primary" icon="el-icon-edit" @click="handlerAlter(2)">修改</el-button>
        <el-button :size="'mini'" type="primary" icon="el-icon-delete" @click="handlerDel(2)">删除</el-button>-->
        <!--        <el-dropdown @command="handlerBtn" trigger="click">-->
        <!--          <el-button :size="'mini'" type="primary">-->
        <!--            新增<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
        <!--          </el-button>-->
        <!--          <el-dropdown-menu slot="dropdown">-->
        <!--            <el-dropdown-item command="1">用户组</el-dropdown-item>-->
        <!--            <el-dropdown-item command="2">用户</el-dropdown-item>-->
        <!--          </el-dropdown-menu>-->
        <!--        </el-dropdown>-->
        <!--        <el-dropdown @command="handlerAlter" trigger="click">-->
        <!--          <el-button :size="'mini'" type="primary">-->
        <!--            修改<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
        <!--          </el-button>-->
        <!--          <el-dropdown-menu slot="dropdown">-->
        <!--            <el-dropdown-item command="1">用户组</el-dropdown-item>-->
        <!--            <el-dropdown-item command="2">用户</el-dropdown-item>-->
        <!--          </el-dropdown-menu>-->
        <!--        </el-dropdown>-->
        <!--        <el-dropdown @command="handlerDel" trigger="click">-->
        <!--          <el-button :size="'mini'" type="primary">-->
        <!--            删除<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
        <!--          </el-button>-->
        <!--          <el-dropdown-menu slot="dropdown">-->
        <!--            <el-dropdown-item command="1">用户组</el-dropdown-item>-->
        <!--            <el-dropdown-item command="2">用户</el-dropdown-item>-->
        <!--          </el-dropdown-menu>-->
        <!--        </el-dropdown>-->
        <!--<el-button style="float: right" :size="'mini'" type="primary" >权限管理</el-button>
        <el-button style="float: right" :size="'mini'" type="primary" >权限浏览</el-button>
    <el-button :size="'mini'" type="primary" icon="el-icon-error" @click="disable" >禁用</el-button>
    <el-button :size="'mini'" type="primary" icon="el-icon-success" @click="enable" >启用</el-button>
    <el-button style="float: right" :size="'mini'" type="primary" >保存权限</el-button>-->
        <el-button v-for="(t,i) in btnList" :key="i" v-if="t.category == 'default'" :size="'mini'" type="primary" :icon="t.cuicon"
                   @click="onFun(t.path)">{{t.menuName}}
        </el-button>
        <el-button :size="'mini'" type="primary" icon="el-icon-refresh" @click="upload">刷新</el-button>
      </el-button-group>
    </el-form>
  </div>
</template>

<script>import {mapGetters} from 'vuex'
import {alterUsers} from '@/api/system/index'
import {getByUserAndPrId} from '@/api/system/index'

export default {
  data() {
    return {
      btnList: [],
      search: {
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters(['node', 'clickData'])
  },
  mounted() {
    let path = this.$route.meta.id
    getByUserAndPrId(path).then(res => {
      this.btnList = res.data
      this.$forceUpdate()
    })
  },
  methods: {
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
    handlerBtn(command) {
      if (command == '1') {
        this.$emit('showGroupDialog')
      } else if (command == '2') {
        this.$emit('showDialog')
      }
    },
    handlerAlter(command) {
      if (command == '1') {
        if (this.clickData.gpId) {
          this.$emit('showGroupDialog', this.clickData)
        } else {
          this.$message({
            message: '无选中行',
            type: 'warning'
          })
        }
      } else if (command == '2') {
        console.log(this.clickData)
        if (this.clickData.uid) {
          this.$emit('showDialog', {uid: this.clickData.uid})
        } else {
          this.$message({
            message: '无选中行',
            type: 'warning'
          })
        }
      }
    },
    upload() {
      this.$emit('uploadList')
    },
    disable() {
      if (this.clickData.uid) {
        this.clickData.disable = true
        this.clickData.status = 2
        alterUsers(this.clickData).then(res => {
          if (res.flag) {
            this.$emit('uploadAll')
          }
        })
      } else {
        this.$message({
          message: '无选中行',
          type: 'warning'
        })
      }
    },
    enable() {
      if (this.clickData.uid) {
        this.clickData.disable = false
        this.clickData.status = 0
        alterUsers(this.clickData).then(res => {
          if (res.flag) {
            this.$emit('uploadAll')
          }
        })
      } else {
        this.$message({
          message: '无选中行',
          type: 'warning'
        })
      }
    },
    handlerDel(command) {
      if (command == '1') {
        if (this.clickData.gpId) {
          this.$confirm('是否删除（' + this.clickData.gpName + '），删除后将无法恢复?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('delGroup', this.clickData.gpId)
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
      } else if (command == '2') {
        if (this.clickData.uid) {
          this.$confirm('是否删除（' + this.clickData.empName + '），删除后将无法恢复?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('delList', this.clickData.uid)
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
      }

    }
  }
}
</script>

<style>
</style>
