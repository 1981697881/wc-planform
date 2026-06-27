<template>
  <div class="list-header">
    <el-form v-model="search" :size="'mini'" :label-width="'80px'">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-form-item :label="'客户代码'">
            <el-input v-model="search.custNumber" placeholder="客户代码"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item :label="'子订单号'">
            <el-input v-model="search.poSubNo" placeholder="子订单号"/>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button :size="'mini'" type="primary" icon="el-icon-search" @click="query">查询</el-button>
        </el-col>
        <el-button-group style="float:right">
          <el-button v-for="(t,i) in btnList" :key="i" v-if="t.category == 'default'" :size="'mini'" type="primary"
                     :icon="t.cuicon" @click="onFun(t.path)">{{ t.menuName }}
          </el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-refresh" @click="upload">刷新</el-button>
        </el-button-group>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getByUserAndPrId } from '@/api/system/index'

export default {
  computed: {
    ...mapGetters(['node', 'clickData', 'selections'])
  },
  data() {
    return {
      btnList: [],
      search: {
        custNumber: null,
        poSubNo: null
      }
    }
  },
  mounted() {
    const path = this.$route.meta.id
    getByUserAndPrId(path).then(res => {
      this.btnList = res.data || []
      this.$forceUpdate()
    })
  },
  methods: {
    onFun(methodStr, event) {
      const match = methodStr.match(/^(\w+)\((.*)\)$/)
      if (match) {
        const methodName = match[1]
        const argsString = match[2]
        let args = argsString ? argsString.split(',').map(arg => arg.trim()) : []
        args = args.map(arg => {
          const num = Number(arg)
          if (!isNaN(num)) return num
          if (arg === 'true') return true
          if (arg === 'false') return false
          if ((arg.startsWith("'") && arg.endsWith("'")) || (arg.startsWith('"') && arg.endsWith('"'))) {
            return arg.slice(1, -1)
          }
          return arg
        })
        this[methodName](...args, event)
      } else {
        this[methodStr](event)
      }
    },
    qFilter() {
      const obj = {}
      if (this.search.custNumber != null && this.search.custNumber !== '') obj.custNumber = this.search.custNumber
      if (this.search.poSubNo != null && this.search.poSubNo !== '') obj.poSubNo = this.search.poSubNo
      return obj
    },
    query() {
      this.$emit('queryBtn', this.qFilter())
    },
    exportData() {
      this.$emit('exportData')
    },
    upload() {
      this.search.custNumber = ''
      this.search.poSubNo = ''
      this.$emit('uploadList')
    }
  }
}
</script>

<style>
</style>
