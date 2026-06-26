<template>
  <div>
    <list
      class="list-main box-shadow"
      :columns="columns"
      :loading="loading"
      :list="list"
      index
      type
      ref="list"
      @handle-size="handleSize"
      @handle-current="handleCurrent"
      @row-click="rowClick"
    />
    <div class="order-print-component">
      <!-- 打印内容区域 -->
      <div class="print-content order-content" ref="orderContent" :class="{ 'hidden-content': !showOrderPreview }">
        <div class="print-container">
          <div class="header">
            <div></div>
          </div>

          <div class="info-row">
            <div>部门：{{orderTable.deptName}}</div>
            <div>订单包装明细表</div>
            <div>日期：{{ orderTable.date }}</div>
          </div>

          <table>
            <thead>
            <tr>
              <th rowspan="3" class="col-client">客户名称</th>
              <th rowspan="3" class="col-order">订单号码</th>
              <th rowspan="3" class="col-date">产品位置</th>
              <th colspan="12" class="col-category">产品种类及包装内容</th>
              <th rowspan="4" class="col-box">箱号（包装件数）</th>
            </tr>
            <tr>
              <th colspan="4">门类</th>
              <th colspan="4">整装家具</th>
              <th colspan="1">墙板</th>
              <th colspan="1">吊顶</th>
              <th rowspan="3">活动家具</th>
              <th rowspan="3">其它</th>
            </tr>
            <tr class="sub-category">
              <th>门</th>
              <th>框</th>
              <th>哑口</th>
              <th>线</th>
              <th>书、衣柜</th>
              <th>酒柜</th>
              <th>台面</th>
              <th>博古架</th>
              <th>墙板</th>
              <th>吊顶</th>
            </tr>
            <tr>
              <th>{{ orderTable.custName }}</th>
              <th>{{ orderTable.orderNo }}</th>
              <th></th><!--{{ orderTable.productPosition }}-->
              <th>{{ orderTable.doorType }}</th>
              <th></th>
              <th></th>
              <th></th>
              <th>{{ orderTable.suit }}</th>
              <th>{{ orderTable.wallBoard }}</th>
              <th>{{ orderTable.suspendCeiling }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in orderTable.pblEntry" :key="index">
              <td colspan="3">{{ item.productPosition }}</td>
              <td colspan="12">{{ item.itemName }}{{ item.itemDesc }}</td>
              <td>{{ item.boxNo }}</td>
            </tr>
            <!-- 空行填充 -->
            <tr v-for="i in orderEmptyRows" :key="'empty-' + i">
              <td colspan="3">&nbsp;</td>
              <td colspan="12">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td colspan="16" style="text-align: left">异常情况说明</td>
            </tr>
            <tr>
              <td colspan="16">
                <div class="info-row">
                  <div>审批：</div>
                  <div>审批：</div>
                  <div style="padding-right: 60px;">制表：</div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 包装标签内容 -->
      <!--<div class="print-content label-content" ref="labelContent" :class="{ 'hidden-content': !showLabelPreview }">
        <div class="label-container" v-for="(item, index) in orderTable.pblEntry" :key="index">
          <div class="label-content">
            <div>
              <div class="label-title">包装明细表</div>
              <div class="label-item">
                <strong>订单号码：</strong>
                <span>{{ orderTable.orderNo }}</span>
              </div>

              <div class="label-item">
                <strong>客户名称：</strong>
                <span>{{ orderTable.custName }}</span>
              </div>

              <div class="label-item">
                <strong>工程地址：</strong>
                <span>{{ orderTable.projectAddr }}</span>
              </div>

              <div class="label-item">
                <strong>产品位置：</strong>
                <span>{{ orderTable.productPosition }}</span>
              </div>

              <div class="label-item">
                <strong>产品页码：</strong>
                <span>{{ orderTable.productPage }}</span>
              </div>

              <div class="label-item">
                <strong>产品明细：</strong>
                <span>{{ item.itemName }}{{ item.itemDesc }}</span>
              </div>
            </div>

            <div class="label-footer">
              <div>
                <strong>第{{ item.boxNo }}件</strong>
              </div>
            </div>
          </div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPackageBoxByPage, deletePackage } from '@/api/information/index'
import List from '@/components/List'
import CheckboxGroupModal from '@/components/CheckboxGroupModal'
export default {
  components: {
    List,
    CheckboxGroupModal
  },
  computed: {
    ...mapGetters(['node']),
    orderEmptyRows() {
      const filledRows = this.orderTable.pblEntry? this.orderTable.pblEntry.length : 0
      const totalRows = Math.max(18, filledRows + this.emptyRowCount)
      return totalRows - filledRows
    }
  },
  data() {
    return {
      orderTable: {},
      showOrderPreview: false,
      showLabelPreview: false,
      currentDate: this.formatDate(new Date()),
      labelData: {
        orderNumber: 'DZ2507071-1',
        customerName: '江阴屈总',
        projectAddress: '江阴绿苑居195号',
        productLocation: '二层主卧E立面柜',
        pageNumber: '第13页',
        productDetails: '抽屉2个',
        itemNumber: '32'
      },
      emptyRowCount: 4,
      loading: false,
      visible: false,
      list: {},
      fid: null,
      type: null,
      columns: [
        { text: '客户名称', name: 'custName' },
        { text: '订单号码', name: 'orderNo' },
        { text: '包装时间', name: 'date' },
        { text: '部门', name: 'deptName' },
        { text: '门类', name: 'doorType' },
        { text: '整装家具', name: 'suit' },
        { text: '墙板', name: 'wallBoard' },
        { text: '吊顶', name: 'suspendCeiling' },
        { text: '活动家具', name: 'movableSuit' },
        { text: '其他', name: 'other' },
        {text: '最后更新日期', name: 'updateTime'},
        {text: '备注', name: 'itemDesc' }

      ],
      logoPath: '', // 动态设置
      // 所有可选项的列表
      checkOptions: [
      ],
      // 当前被选中的值，是一个数组
      checkedValues: [] // 设置默认选中的项
    }
  },
  created() {
    // 初始化图片路径
    this.logoPath = require('@/assets/images/logon.png')

  },
  methods: {
    // 在您的 Vue 组件方法中
    async openComponentMsgMsgBox(val) {
      const obj = {...val}
      this.checkOptions = obj.pblEntry.map((item) => {
        return { label: item.boxNo, value: item.id }
      })

      const h = this.$createElement

      // 在渲染函数中直接使用导入的组件
      const checkboxComponent = h(CheckboxGroupModal, {
        props: {
          value: this.checkedValues,
          options: this.checkOptions
        },
        on: {
          // 监听子组件的 input 事件，更新主组件的数据
          input: (newValues) => {
            this.checkedValues = newValues;
          }
        }
      });

      try {
        await this.$msgbox({
          title: '明细选择',
          message: checkboxComponent, // 传入组件
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              if (this.checkedValues.length === 0) {
                this.$message.warning('请至少选择一项');
                return false;
              }
              console.log('最终提交的数据:', this.checkedValues);
              obj.pblEntry = this.filterSelectedData(this.checkedValues, obj.pblEntry)
              this.printLabel(obj)
              done();
            } else {
              done();
            }
          }
        });
        // this.$message.success(`提交成功! 选择: ${this.checkedValues.join(', ')}`);
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.info('操作已取消');
        }
      }
    },
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    async printOrderTable(objOrList) {
      const items = Array.isArray(objOrList) ? objOrList : [objOrList]
      if (!items.length) {
        this.$message.warning('请至少选择一条数据')
        return
      }

      let pagesHTML = ''
      for (let i = 0; i < items.length; i++) {
        this.orderTable = items[i]
        await this.$nextTick()
        const pageBreak = i < items.length - 1 ? ' style="page-break-after: always;"' : ''
        pagesHTML += `<div class="order-print-page"${pageBreak}>${this.$refs.orderContent.innerHTML}</div>`
      }

      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('请允许弹出窗口以进行打印')
        return
      }
      printWindow.onload = function() {
        printWindow.moveTo(0, 0)
        printWindow.resizeTo(screen.availWidth, screen.availHeight)
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>订单包装明细表</title>
          <style>
            ${this.getOrderPrintStyles()}
            .order-print-page {
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body>
          ${pagesHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            };
          <\/script>
        </body>
        </html>
      `)

      printWindow.document.close()
    },
    generateQRCode(text) {
      // 使用在线QR码生成服务
      const encodedText = encodeURIComponent(text)
      return `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodedText}`
    },
    filterSelectedData(selectedIds, sourceData) {
      if (!Array.isArray(selectedIds) || !Array.isArray(sourceData)) {
        return []
      }
      // 1. 从选中的ID中过滤掉id为1
      const filteredIds = selectedIds.filter(id => id !== 1);
      // 2. 从源数据中找出对应ID的数据
      const result = filteredIds
        .map(id => sourceData.find(item => item.id === id))
        .filter(item => item !== undefined) // 过滤掉未找到的项目
      return result
    },
    printLabel(obj) {

      this.orderTable = obj
      this.$nextTick(() => {
        const printContent = this.$refs.labelContent

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          alert('请允许弹出窗口以进行打印')
          return
        }else{
          printWindow.onload = function() {
            printWindow.moveTo(0, 0);
            printWindow.resizeTo(screen.availWidth, screen.availHeight);
          };
        }

        // 生成多个标签的HTML
        const labelsHTML = this.orderTable.pblEntry.map((item, index) => {

          const qrSrc = this.generateQRCode(this.orderTable.orderNo + ',' + item.seq + ',' + item.boxNo)
          // <img src="${this.logoPath}">
          return `
          <div class="label-page" ${index < this.orderTable.pblEntry.length - 1 ? 'style="page-break-after: always;"' : ''}>
            <div class="label-container">
              <div class="label-content">
                <div>
                  <div class="label-title">包装明细表</div>
                    <div class="label-logo">

                    </div>
                   <div class="qr-code-area">
                    <div class="qr-container">
                      <img src="${qrSrc}" alt="QR Code" class="qr-image" />
                    </div>
                  </div>
                  <div class="label-item">
                    <strong>订单号码：</strong>
                    <span>${this.orderTable.orderNo || ''}</span>
                  </div>

                  <div class="label-item">
                    <strong>客户名称：</strong>
                    <span>${this.orderTable.custName || ''}</span>
                  </div>

                  <div class="label-item">
                    <strong>工程地址：</strong>
                    <span>${this.orderTable.projectAddr || ''}</span>
                  </div>

                  <div class="label-item">
                    <strong>产品位置：</strong>
                    <span>${item.productPosition || ''}</span>
                  </div>

                  <div class="label-item">
                    <strong>产品页码：</strong>
                    <span>${item.productPage || ''}</span>
                  </div>

                  <div class="label-item">
                    <strong>产品明细：</strong>
                    <span>${item.itemName || ''} ${item.itemDesc || ''} </span>
                  </div>
                </div>
                <div class="label-footer">
                  <div>
                    <strong>第${item.boxNo}件</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
        }).join('')

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>包装标签</title>
            <style>
              ${this.getLabelPrintStyles()}
            </style>
          </head>
          <body>
            <div class="labels-print">
              ${labelsHTML}
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 100);
              };
            <\/script>
          </body>
          </html>
        `)

        printWindow.document.close()
      })
    },

    getOrderPrintStyles() {
      return `
        @page {
          size: A4 landscape;
          margin: 0.5cm;
        }

        body {
          font-family: "Microsoft YaHei", Arial, sans-serif;
          margin: 0;
          padding: 0;
          font-size: 12px;
          line-height: 1.4;
          color: #000;
        }

        .print-container {
          width: 29.7cm;
          min-height: 21cm;
          padding: 0.5cm;
          box-sizing: border-box;
        }

        .header {
          text-align: center;
          margin-bottom: 10px;
        }

        .company-name {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .company-en-name {
          font-size: 14px;
          margin-bottom: 5px;
        }

        .title {
          font-size: 18px;
          font-weight: bold;
          margin: 10px 0;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #000;
          table-layout: fixed;
        }

        th, td {
          border: 1px solid #000;
          padding: 5px;
          text-align: center;
          vertical-align: middle;
          word-break: break-all;
        }

        th {
          background-color: #f0f0f0;
          font-weight: bold;
        }

        .col-client { width: 12%; }
        .col-order { width: 10%; }
        .col-date { width: 10%; }
        .col-category { width: 48%; }
        .col-box { width: 8%; }

        .sub-category {
          font-size: 11px;
        }

        @media print {
          body {
            margin: 0;
            padding: 0;
          }
        }
      `
    },

    getLabelPrintStyles() {
      return `
        @page {
          size: 100mm 100mm;
          margin: 1mm; /* 减小边距 */
        }

        body {
          font-family: "Microsoft YaHei", Arial, sans-serif;
          margin: 0;
          padding: 0;
        }

        .label-page {
          width: 100mm;
          height: 100mm;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .label-container {
          position:relative;
          width: 98mm; /* 减去边距 */
          height: 98mm;
          background-color: #ffeb3b;
          padding: 1mm;
          box-sizing: border-box;
        }

        .label-content {
          padding-top: 10%;
          height: 90%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .label-title {
          font-size: 20px; /* 调整字体大小以适应减小的高度 */
          font-weight: bold;
          text-align: center;
          margin-bottom: 10px;
          padding-bottom: 2px;
        }
        .label-logo {
          position:absolute;
          top: 2mm;
          left: 10mm;
        }
        .label-logo img{
          width: 15mm;
          height: 15mm;
        }
        .label-item {
          width: 100%;
          line-height: 35px;
          font-size: 16px;
        }

        .label-item strong {
          display: inline-block;
          width: 80px;
        }
        .label-item span {
          word-break:break-all;
        }
        .label-footer {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
        }
         .qr-code-area {
              width: 20mm;
              position:absolute;
              top: 10mm;
              right: 5mm;
            }

            .qr-container {
              width: 20mm;
              height: 20mm;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: white;
            }

            .qr-image {
              width: 18mm;
              height: 18mm;
            }
        @media print {
          body {
            margin: 0;
            padding: 0;
            background-color: white !important;
          }

          .label-container {
            background-color: #ffeb3b !important;
          }
        }
      `
    },
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
        excel.export_json_to_excel(tHeader,data,'包装信息')
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
      deletePackage(val).then(res => {
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
      getPackageBoxByPage(data, val).then(res => {
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
.combined-print-component {
  font-family: "Microsoft YaHei", Arial, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.print-controls {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.control-group {
  text-align: center;
}

.control-group h3 {
  margin-bottom: 15px;
  color: #333;
}

.print-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin: 0 10px 10px 0;
}

.print-btn:hover {
  background-color: #45a049;
}

.hidden-content {
  position: absolute;
  left: -9999px;
  top: -9999px;
  visibility: hidden;
}

.print-content:not(.hidden-content) {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 20px 0;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 订单表格样式 */
.order-content .print-container {
  width: 100%;
  font-size: 12px;
}

.order-content .header {
  text-align: center;
  margin-bottom: 10px;
}

.order-content .company-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.order-content .company-en-name {
  font-size: 14px;
  margin-bottom: 5px;
}

.order-content .title {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
}

.order-content .info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.order-content table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
  table-layout: fixed;
}

.order-content th, .order-content td {
  border: 1px solid #000;
  padding: 5px;
  text-align: center;
  vertical-align: middle;
  word-break: break-all;
}

.order-content th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.order-content .col-client { width: 12%; }
.order-content .col-order { width: 10%; }
.order-content .col-date { width: 10%; }
.order-content .col-category { width: 48%; }
.order-content .col-box { width: 8%; }

.order-content .sub-category {
  font-size: 11px;
}

/* 标签样式 */


.label-container {
  width: 340px;
  height: 415px;
  background-color: #ffeb3b;
  border: 2px dashed #ccc;
  padding: 15px;
  position: relative;
}


.label-content .label-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  border-bottom: 2px solid #000;
  padding-bottom: 5px;
}

.label-content .label-item {
  margin-bottom: 10px;
  font-size: 18px;
}

.label-content .label-item strong {
  display: inline-block;
  width: 100px;
}

.label-content .label-footer {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin-top: 10px;
}
</style>
