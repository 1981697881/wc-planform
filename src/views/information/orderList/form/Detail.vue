<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" :size="'mini'" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="'订单日期'" prop="poDate">
            <el-date-picker
              v-model="form.poDate"
              type="date"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              :disabled="readonly"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!--<el-form-item :label="'订单号'" prop="fgender">
            <el-select style="width: 100%" v-model="form.fgender" placeholder="请选择">
              <el-option
                v-for="(item,index) in levelFormat"
                :key="index"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item :label="'母订单号'" prop="poNo">
            <el-input v-model="form.poNo" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'子订单号'" prop="subPoNo">
            <el-input v-model="form.subPoNo" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="'销售地'">
            <el-select style="width: 100%" v-model="form.saleOrgin" :disabled="readonly" placeholder="请选择">
              <el-option
                v-for="(item,index) in saleOrginList"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'客户'" prop="custId">
            <el-select style="width: 100%" filterable
                       remote
                       :remote-method="remoteCustMethod"
                       :loading="loading"
                       v-model="form.custId"
                       :disabled="readonly"
                       @change="handleCustomerChange"
                       placeholder="请选择">
              <el-option
                      v-for="(item,index) in custList"
                      :key="index"
                      :label="item.custName+'-'+item.addr"
                      :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'产品数量'">
            <el-input-number :min="0" v-model="form.prdQty" :disabled="readonly"></el-input-number>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">
          <el-form-item :label="'产品编码'" prop="productNumber">
            <el-input v-model="form.productNumber"></el-input>
          </el-form-item>
        </el-col>-->

      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="'产品名称'" prop="productName">
            <el-input v-model="form.productName" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'材质'">
            <el-input v-model="form.productTxture" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'油漆工艺'">
            <el-input v-model="form.productPaint" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item :label="'产品名称(简略)'">
            <el-input v-model="form.prodShortName" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'预计交货日期'">
            <el-date-picker
              v-model="form.deliveryDate"
              type="date"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              :disabled="readonly"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="'五金单'">
            <el-input v-model="form.wuJin" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'交货日期'">
            <el-input v-model="form.orderDate" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'客户要求日期'">
            <el-date-picker
              v-model="form.custReqDate"
              type="date"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              :disabled="readonly"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <!-- <el-form-item :label="'客户'">
             <el-input v-model="form.custName"></el-input>
           </el-form-item>-->
        </el-col>
      </el-row>
      <el-row :gutter="20">


        <el-col :span="8">
          <el-form-item :label="'发货时间'">
            <el-date-picker
              v-model="form.sendDate"
              type="date"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              :disabled="readonly"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
       <!-- <el-col :span="12">
          <el-form-item :label="'销售部门'">
            <el-input v-model="form.deptName"></el-input>
          </el-form-item>
          <el-form-item :label="'销售部门'">
            <el-select
              filterable
              remote
              :remote-method="remoteMethod"
              :loading="loading"
              style="width: 100%"
              v-model="form.fteamleader"
              placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.fid"
                :label="item.fenglishname +'-'+item.fname"
                :value="item.fenglishname">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>-->
        <el-col :span="8">
          <el-form-item :label="'页数'">
            <el-input v-model="form.pageNo" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'设计员'">
            <el-input v-model="form.designer" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="'发货地址'">
            <el-input v-model="form.custAddr" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'工地地址'">
            <el-input v-model="form.workSiteAddr" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'联系电话'">
            <el-input v-model="form.custTel" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="'发货单号'">
            <el-input v-model="form.sendNo" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'发货方式'">
            <el-input v-model="form.sendWay" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'合同状态'">
            <el-radio-group v-model="form.poStatus" :disabled="readonly">
              <el-radio label="发齐">发齐</el-radio>
              <el-radio label="未发齐">未发齐</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item :label="'备注'">
            <el-input v-model="form.note" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'物料清单'" v-if="!readonly">
            <el-button @click="setRow">增加</el-button>
            <el-button @click="delRow">删除</el-button>
          </el-form-item>
          <el-form-item :label="'物料清单'" v-else>
            <span></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-table class="tableBox" :class="{ 'table-readonly': readonly }" ref="multipleTable" @selection-change="handleSelectionChange" border height="250px"
                  stripe size="mini" :highlight-current-row="!readonly" :data="form.prdOrderEntry" align="center"
                  :cell-style="myclass" highlight-current-row>
          <el-table-column v-if="!readonly" align="center" type="selection"></el-table-column>
          <el-table-column prop="date" label="序号" type="index" align="center" sortable></el-table-column>
          <el-table-column
            v-for="(t,i) in columns"
            :key="i"
            align="center"
            :prop="t.name"
            :label="t.text"
          >
            <template slot-scope="scope">
              <!--// 通过 v-if="!item.sfkgg" 控制是否可编辑单元格 //-->

              <div v-if="t.name === 'itemType'">
                <el-select filterable
                         style="width: 100%" v-if="!t.sfkgg && !readonly" v-model="scope.row[t.name]"
                          placeholder="请选择">
                 <el-option
                   v-for="(item, index) in optionList"
                   :key="index"
                   :label="item.label"
                   :value="item.label">
                 </el-option>
               </el-select>
                <span>{{scope.row[t.name]}}</span>
              </div>
              <div v-else>
                <el-input v-if="!t.sfkgg && !readonly" v-model="scope.row[t.name]" clearable/>
                <span>{{scope.row[t.name]}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <div slot="footer" style="text-align:center;">
      <el-button v-if="!readonly" type="primary" @click="saveData('form')">保存</el-button>
      <el-button v-else @click="$emit('hideDialog', false)">关闭</el-button>
    </div>
  </div>
</template>

<script>import {addProdOrder, deleteDProdOrder} from '@/api/information/index'
import {getTuserList, getCustomerByPage} from '@/api/basic/index'

export default {
  props: {
    listInfo: {
      type: Object,
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        poDate: null,
        poNo: null,
        prdQty: null,
        productNumber: null,
        productName: null,
        prodShortName: null,
        productSpec: null,
        /*custName: null,
        deptName: null,*/
        subPoNo: null,
        custId: null,
        productTxture: null,
        productPaint: null,
        pageNo: null,
        designer: null,
        deliveryDate: null,
        custReqDate: null,
        custAddr: null,
        custTel: null,
        sendDate: null,
        sendNo: null,
        poStatus: null,
        note: null,
        sendWay: null,
        workSiteAddr: null,
        wuJin: null,
        saleOrgin: null,
        orderDate: null,
        prdOrderEntry: [],
      },
      loading: false,
      columns: [
        {text: '级别', name: 'itemLevel'},
        {text: '物料属性', name: 'itemType'},
        {text: '物料编码', name: 'itemNumber'},
        {text: '物料名称', name: 'itemName'},
        {text: '物料规格', name: 'itemSpec'},
        {text: '数量', name: 'qty'},
      ],
      userList: [],
      custList: [],
      optionList: [
        {label: '产品', value: '产品'},
        {label: '物料', value: '物料'},
        {label: '半成品', value: '半成品'},
      ],saleOrginList: [
        {label: '经销商', value: '经销商'},
        {label: '深圳', value: '深圳'},
        {label: '工厂', value: '工厂'},
        {label: '广州', value: '广州'},
      ],
      multipleSelection: [],
      rules: {
        poDate: [
          {required: true, message: '请选择', trigger: 'change'}
        ], poNo: [
          {required: true, message: '请输入', trigger: 'blur'}
        ], productNumber: [
          {required: true, message: '请输入', trigger: 'blur'}
        ], productName: [
          {required: true, message: '请输入', trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    if (this.listInfo) {
      this.form = this.listInfo;
    }
    // 优先确保当前客户回显（先加载选中客户，再加载默认列表）
    if (this.form.custId) {
      this.ensureCurrentCustomerInList();
    }
    this.getCustsArray(); // 加载默认客户列表（异步，最终会被 ensure... 修正）
  },
  methods: {
    // 确保当前选中的客户在 custList 中，否则根据 id 查询并添加
    ensureCurrentCustomerInList() {
      const custId = this.form.custId;
      if (!custId) return;
      const exists = this.custList.some(item => item.id === custId);
      if (!exists) {
        this.loading = true;
        getCustomerByPage({ pageNum: 1, pageSize: 1 }, { id: custId }).then(res => {
          this.loading = false;
          if (res.flag && res.data.records && res.data.records.length) {
            const customer = res.data.records[0];
            if (!this.custList.some(item => item.id === customer.id)) {
              this.custList.unshift(customer); // 添加到列表头部保证回显
            }
          }
        }).catch(() => {
          this.loading = false;
        });
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.getUsersArray({fenglishname: query});
      } else {
        this.userList = [];
      }
    },
    remoteCustMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.getCustsArray({custName: query});
      } else {
        this.custList = [];
      }
    },
    handleCustomerChange(custId) {
      if (this.readonly) return
      if (this.form.workSiteAddr) return;
      const customer = this.custList.find(item => item.id === custId);
      if (customer && customer.addr) {
        this.form.workSiteAddr = customer.addr;
      }
    },
    myclass({row, columnIndex}) {
      if (row[columnIndex] && !row[columnIndex].sfcb && row[columnIndex].sfcb != null) {
        return "color: red";
      }
    },
    setRow() {
      var itemObj = Object.assign({
        sfkgg: true,
        sfcb: null,
      })
      console.log(itemObj)
      if(this.form.prdOrderEntry == null){
        this.form.prdOrderEntry = []
      }
      this.form.prdOrderEntry.push(itemObj)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    delRow() {
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach((item) => {
          if(this.form.id && item.id){
            deleteDProdOrder({id: item.id}).then(res => {
              if(res.flag) {
                this.form.prdOrderEntry.splice(item)
              }
            });
          }else{
            this.form.prdOrderEntry.splice(item)
          }
        })
      } else {
        this.$message({
          message: "请选择删除项",
          type: 'error'
        });
      }
    },
    getCustsArray(val = {}, data = { pageNum: 1, pageSize: 100 }) {
      getCustomerByPage(data, val).then(res => {
        if (res.flag) {
          this.loading = false;
          this.custList = res.data.records || [];
          this.ensureCurrentCustomerInList(); // ← 关键：合并当前客户
        }
      });
    },
    getUsersArray(val = {}, data = {
      pageNum: 1,
      pageSize: 10
    }) {
      getTuserList(data, val).then(res => {
        if (res.flag) {
          this.loading = false;
          this.userList = res.data.records
        }
      });
    },
    saveData(form) {
      this.$refs[form].validate((valid) => {
        // 判断必填项
        if (valid) {
          let params = {...this.form}
          addProdOrder(params).then(res => {
            this.$emit('hideDialog', false)
            this.$emit('uploadList')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
  .tableBox {
    margin-bottom: 20px;
  }

  /* 通过显隐控制input框的状态 */
  .tableBox .el-input {
    display: none;
  }

  .tableBox .current-row .el-input {
    display: block;
  }

  .tableBox .current-row .el-input + span {
    display: none;
  }

  /* 通过显隐控制input框的状态 */
  .tableBox .el-select {
    display: none;
  }

  .tableBox .current-row .el-select {
    display: block;
  }

  .tableBox .current-row .el-select + span {
    display: none;
  }

  .table-readonly .el-input {
    display: none !important;
  }

  .table-readonly .el-input + span {
    display: inline !important;
  }

  .table-readonly .el-select {
    display: none !important;
  }

  .table-readonly .el-select + span {
    display: inline !important;
  }
</style>
