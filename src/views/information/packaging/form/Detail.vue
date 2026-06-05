<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" :size="'mini'" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'客户名称'" prop="custName">
            <el-input v-model="form.custName" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'订单号码'" prop="orderNo">
            <el-input v-model="form.orderNo" :disabled="readonly" @blur="queryOrderData(form.orderNo)"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'包装时间'" prop="date">
            <el-date-picker
              v-model="form.date"
              type="date"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              :disabled="readonly"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'部门'" prop="deptName">
            <el-input v-model="form.deptName" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'工程地址'">
            <el-input v-model="form.projectAddr" :disabled="readonly"></el-input>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="12">-->
        <!--          <el-form-item :label="'产品位置'" >-->
        <!--            <el-input v-model="form.productPosition"></el-input>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <!--        <el-col :span="12">-->
        <!--          <el-form-item :label="'产品页码'" >-->
        <!--            <el-input v-model="form.productPage"></el-input>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :span="12">
          <el-form-item :label="'活动家具'">
            <el-checkbox v-model="form.movableSuit" :true-label="1" :false-label="0" :disabled="readonly"></el-checkbox>
          </el-form-item>
          <!--<el-form-item :label="'活动家具'">
            <el-input-number :min="0" v-model="form.movableSuit"></el-input-number>
          </el-form-item>-->
        </el-col>
      </el-row>
      <el-row :gutter="20">

        <el-col :span="12">
          <!--          <el-form-item :label="'门类'" prop="fgender">-->
          <!--            <el-select style="width: 100%" v-model="form.fgender" placeholder="请选择">-->
          <!--              <el-option-->
          <!--                v-for="(item,index) in levelFormat"-->
          <!--                :key="index"-->
          <!--                :label="item.label"-->
          <!--                :value="item.value">-->
          <!--              </el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item :label="'门类'">
            <el-checkbox v-model="form.doorType" :true-label="1" :false-label="0" :disabled="readonly"></el-checkbox>
          </el-form-item>
          <!--          <el-form-item :label="'门类'">-->
          <!--            <el-input-number :min="0" v-model="form.doorType"></el-input-number>-->
          <!--          </el-form-item>-->
        </el-col>
        <el-col :span="12">
          <!--          <el-form-item :label="'整装家具'" prop="fgender">
                      <el-select style="width: 100%" v-model="form.fgender" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in levelFormat"
                          :key="index"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>-->
          <el-form-item :label="'整装家具'">
            <el-checkbox v-model="form.suit" :true-label="1" :false-label="0" :disabled="readonly"></el-checkbox>
          </el-form-item>
          <!--          <el-form-item :label="'整装家具'">
                      <el-input-number :min="0" v-model="form.suit"></el-input-number>
                    </el-form-item>-->
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'墙板'">
            <el-checkbox v-model="form.wallBoard" :true-label="1" :false-label="0" :disabled="readonly"></el-checkbox>
          </el-form-item>
          <!--          <el-form-item :label="'墙板'">
                      <el-input-number :min="0" v-model="form.wallBoard"></el-input-number>
                    </el-form-item>-->
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'吊顶'">
            <el-checkbox v-model="form.suspendCeiling" :true-label="1" :false-label="0" :disabled="readonly"></el-checkbox>
          </el-form-item>
          <!--          <el-form-item :label="'吊顶'">-->
          <!--            <el-input-number :min="0" v-model="form.suspendCeiling"></el-input-number>-->
          <!--          </el-form-item>-->
        </el-col>
      </el-row>
      <el-row :gutter="20">


        <!--<el-col :span="12">
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

      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'明细信息'" v-if="!readonly">
            <el-button @click="setRow">增加</el-button>
            <el-button @click="delRow">删除</el-button>
          </el-form-item>
          <el-form-item :label="'明细信息'" v-else>
            <span></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-table class="tableBox" :class="{ 'table-readonly': readonly }" ref="multipleTable" @selection-change="handleSelectionChange" border height="250px"
                  stripe size="mini" :highlight-current-row="!readonly" :data="form.pblEntry" align="center"
                  :cell-style="myclass" highlight-current-row>
          <el-table-column v-if="!readonly" align="center" type="selection"></el-table-column>
          <el-table-column prop="date" label="序号" type="index" align="center" sortable></el-table-column>
          <el-table-column
            v-for="(t,i) in columns"
            :key="i"
            align="center"
            :prop="t.name"
            :label="t.text"
            :width="t.width?t.width:''"
          >
            <template slot-scope="scope">
              <div v-if="t.name === 'photoFiles'">
                <!-- 图片预览区域 -->
                <!--                <div v-if="scope.row.photoFiles && scope.row.photoFiles.length > 0" class="image-preview">-->
                <!--                  <el-image-->
                <!--                    v-for="(img, imgIndex) in scope.row.photoFiles"-->
                <!--                    :key="imgIndex"-->
                <!--                    style="width: 50px; height: 50px; margin-right: 5px;"-->
                <!--                    :src="getImageUrl(img)"-->
                <!--                    :preview-src-list="getPreviewList(scope.row.photoFiles)"-->
                <!--                    fit="cover"-->
                <!--                  >-->
                <!--                  </el-image>-->
                <!--                </div>-->
                <!--                <span v-else class="no-image">暂无图片</span>-->
                <el-button size="mini" type="primary" icon="el-icon-view" @click="handlePreview(scope.row)">查看图片
                </el-button>
                <!-- 图片上传组件 -->
                <el-upload
                  v-if="!readonly"
                  :show-file-list="false"
                  :action="fileUrl"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  :headers="headers"
                  name="imgS"
                  style=" float: right;"
                  :before-upload="(file) => beforeUploadImage(file, scope.$index)"
                  :on-success="(res, file, fileList) => uploadSuccess(res, file, fileList, scope.$index)"
                  :on-remove="(file, fileList) => handleRemove(file, fileList, scope.$index)"
                  :on-error="uploadError"
                  class="row-upload"
                >
                  <el-button size="mini" type="primary" icon="el-icon-upload2">导入图片</el-button>
                </el-upload>
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
    <!-- 图片预览对话框 -->
    <!-- 图片预览对话框 -->
    <el-dialog
      append-to-body
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="80%"
      top="5vh"
      :close-on-click-modal="true"
      custom-class="image-preview-dialog"
    >
      <div v-if="currentPreviewRow && currentPreviewRow.photoFiles && currentPreviewRow.photoFiles.length > 0"
           class="dialog-image-content">
        <el-carousel :interval="5000" arrow="always" height="500px" :initial-index="currentImageIndex"
                     @change="handleCarouselChange">
          <el-carousel-item v-for="(img, index) in currentPreviewRow.photoFiles" :key="index">
            <div class="carousel-image-container">
              <el-image
                :src="getImageUrl(img)"
                fit="contain"
                style="width: 100%; height: 100%;"
                :preview-src-list="getPreviewList(currentPreviewRow.photoFiles)"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                  <div>图片加载失败</div>
                </div>
              </el-image>
              <el-button
                v-if="!readonly"
                class="delete-img-btn"
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="deleteImage(index)"
              ></el-button>
            </div>
            <div class="image-description">
              图片 {{ index + 1 }} / {{ currentPreviewRow.photoFiles.length }}
            </div>
          </el-carousel-item>
        </el-carousel>

        <div class="image-info">
          <span>当前图片: {{ currentImageIndex + 1 }} / {{ currentPreviewRow.photoFiles.length }}</span>
        </div>
      </div>
      <div v-else class="no-images">
        暂无图片可预览
      </div>

      <span slot="footer" class="dialog-footer">
   <!-- <el-button type="danger" @click="deleteAllImages"
               v-if="currentPreviewRow && currentPreviewRow.photoFiles && currentPreviewRow.photoFiles.length > 0">删除所有图片</el-button>-->
    <el-button @click="previewDialogVisible = false">关闭</el-button>
  </span>
    </el-dialog>
    <div slot="footer" style="text-align:center;">
      <el-button v-if="!readonly" type="primary" @click="saveData('form')">保存</el-button>
      <el-button v-else @click="$emit('hideDialog', false)">关闭</el-button>
    </div>
  </div>
</template>

<script>import {addPackage, deletepblDeleteBy, getPBListBoxNoByOrderNo, getProdOrderByPage} from '@/api/information/index'
import {getTuserList} from '@/api/basic/index'
import {
  getToken
} from '@/utils/auth'

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
      headers: {
        'authorization': getToken('wcrx'),
      },
      fileUrl: '',
      // 图片预览对话框相关
      previewDialogVisible: false,
      currentPreviewRow: null,
      currentImageIndex: 0,
      images: [],
      imagesPoster: [],
      hidePicture: false,
      hideStillUpload: false,
      dialogImageUrl: '',
      dialogVisible: false,
      pictureList: [],
      limitPicture: 2,
      form: {
        custName: null,
        orderNo: null,
        date: this.formatDate(new Date()),
        doorType: 0,
        suit: 0,
        wallBoard: 0,
        suspendCeiling: 0,
        movableSuit: 0,
        deptName: null,
        projectAddr: null,
        productPosition: null,
        productPage: null,
        pblEntry: [],
      },
      loading: false,
      levelFormat: [
        {label: '门', value: 'boxNo'},
        {label: '框', value: 'itemName'},
        {label: '哑口', value: 'itemDesc'},
        {label: '线', value: 'itemDesc'}
      ],
      levelFormat2: [
        {label: '书、衣柜', value: '书、衣柜'},
        {label: '酒柜', value: '酒柜'},
        {label: '台面', value: '台面'},
        {label: '博古架', value: '博古架'}
      ],
      columns: [
        {text: '产品位置', name: 'productPosition'},
        {text: '部件名称', name: 'itemName'},
        {text: '箱号', name: 'boxNo', width: "100px"},
        {text: '页码', name: 'productPage', width: "100px"},
        // {text: '包装描述', name: 'itemDesc'},
        {text: '图片上传', name: 'photoFiles'},
      ],
      userList: [],
      multipleSelection: [],
      rules: {
        custName: [
          {required: true, message: '请输入', trigger: 'blur'}
        ], orderNo: [
          {required: true, message: '请输入', trigger: 'blur'}
        ], date: [
          {required: true, message: '请输入', trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    this.fileUrl = `${window.location.origin}/web/file/imgUpload`
    if (this.listInfo) {
      this.form = this.listInfo
      // 初始化pblEntry中每行的photoFiles字段[6](@ref)
      if (this.form.pblEntry && this.form.pblEntry.length > 0) {
        this.form.pblEntry.forEach(entry => {
          if (!entry.photoFiles) {
            this.$set(entry, 'photoFiles', [])
          } else if (typeof entry.photoFiles === 'string') {
            // 如果photoFiles是字符串，转换为数组
            entry.photoFiles = [entry.photoFiles]
          }
        })
      }
    }
  },
  methods: {
    queryOrderData(val, data = {
      pageNum: 1,
      pageSize: 1
    }) {
      if (this.readonly) return
      console.log(val)
      getProdOrderByPage(data, {poNo: val}).then(res => {
        const data = res.data.records
        if(data.length>0){
          this.form.custName = data[0].custName || ''
          this.form.projectAddr = data[0].custAddr || ''
        }
      })
    },
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    // 获取完整图片URL
    getImageUrl(imgPath) {
      if (!imgPath) return ''
      // 如果已经是完整URL，直接返回
      if (imgPath.startsWith('http')) {
        return imgPath
      }
      return this.$store.state.user.url + '/images/' + imgPath
    },
    // 获取预览图片列表
    getPreviewList(photoFiless) {
      if (!photoFiless || photoFiless.length === 0) return []
      // 确保返回的是一个数组
      const files = Array.isArray(photoFiless) ? photoFiless : [photoFiless]
      console.log(files.map(img => this.getImageUrl(img)))
      return files.map(img => this.getImageUrl(img))
    },

    // 处理图片预览 - 点击查看图片按钮
    handlePreview(row) {
      if (row.photoFiles && row.photoFiles.length > 0) {
        this.currentPreviewRow = row
        this.currentImageIndex = 0
        this.previewDialogVisible = true
      } else {
        this.$message.info('当前条目暂无图片可预览')
      }
    },

    // 上传前验证[8](@ref)
    beforeUploadImage(file, rowIndex) {
      const isImage = file.type.includes('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2MB!')
        return false
      }

      return true
    },

    // 上传成功处理[1,6](@ref)
    uploadSuccess(res, file, fileList, rowIndex) {
      if (res.flag) {
        // 确保当前行的photoFiles数组存在
        if (!this.form.pblEntry[rowIndex].photoFiles) {
          this.$set(this.form.pblEntry[rowIndex], 'photoFiles', [])
        }

        // 将上传的图片路径添加到当前行的photoFiles数组中[6](@ref)
        this.form.pblEntry[rowIndex].photoFiles.push(res.data)

        this.$message({
          message: res.msg || '上传成功',
          type: "success"
        })
      } else {
        this.$message.error(res.msg || '上传失败')
      }
    },

    // 删除图片[6](@ref)
    handleRemove(file, fileList, rowIndex) {
      if (this.form.pblEntry[rowIndex] && this.form.pblEntry[rowIndex].photoFiles) {
        // 清空当前行的图片[6](@ref)
        this.form.pblEntry[rowIndex].photoFiles = []
        this.$message.success('图片删除成功')
      }
    },

    // 上传失败[8](@ref)
    uploadError(res) {
      this.$message({
        message: res.msg || '上传失败',
        type: "warning"
      })
    },
    // 轮播图切换时更新当前索引
    handleCarouselChange(index) {
      this.currentImageIndex = index;
    },

// 删除指定索引的图片
    deleteImage(imgIndex) {
      this.$confirm('确定要删除这张图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 从当前预览行的图片数组中删除指定图片
        this.currentPreviewRow.photoFiles.splice(imgIndex, 1);

        // 如果删除的是当前显示的图片，调整轮播图索引
        if (imgIndex <= this.currentImageIndex) {
          this.currentImageIndex = Math.max(0, this.currentImageIndex - 1);
        }

        // 如果删除后没有图片了，关闭对话框
        if (this.currentPreviewRow.photoFiles.length === 0) {
          this.previewDialogVisible = false;
          this.$message.success('所有图片已删除');
        } else {
          this.$message.success('图片删除成功');
        }
      }).catch(() => {
        // 用户取消删除
      });
    },

// 删除所有图片
    deleteAllImages() {
      this.$confirm('确定要删除所有图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清空当前预览行的所有图片
        this.currentPreviewRow.photoFiles = [];
        this.previewDialogVisible = false;
        this.$message.success('所有图片已删除');
      }).catch(() => {
        // 用户取消删除
      });
    },
    // 新增行时初始化photoFiles字段[6](@ref)
    async setRow() {
      let newRow = {}
      if (this.form.pblEntry.length > 0) {
        let newData = this.form.pblEntry[this.form.pblEntry.length - 1]
        newRow = {
          boxNo: Number(newData.boxNo) + 1,
          itemName: '',
          itemDesc: '',
          productPage: '',
          productPosition: newData.productPosition,
          sfkgg: true,
          sfcb: null,
          photoFiles: [] // 初始化空的图片数组
        }
      } else {
        if (this.form.orderNo) {
          await getPBListBoxNoByOrderNo({orderNo: this.form.orderNo}).then(res => {
            if (res.flag) {
              newRow = {
                boxNo: res.data.boxNo,
                itemName: '',
                itemDesc: '',
                productPage: '',
                productPosition: '',
                sfkgg: true,
                sfcb: null,
                photoFiles: [] // 初始化空的图片数组
              }
            }
          })
        } else {
          this.$message({
            message: "请录入订单号码",
            type: 'error'
          });
        }
      }
      if (this.form.pblEntry == null) {
        this.form.pblEntry = []
      }
      this.form.pblEntry.push(newRow)
    },

    // 删除行[6](@ref)
    delRow() {
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach((item) => {
          if (this.form.id && item.id) {
            deletepblDeleteBy({id: item.id}).then(res => {
              if (res.flag) {
                const index = this.form.pblEntry.indexOf(item)
                if (index > -1) {
                  this.form.pblEntry.splice(index, 1)
                }
              }
            });
          } else {
            const index = this.form.pblEntry.indexOf(item)
            if (index > -1) {
              this.form.pblEntry.splice(index, 1)
            }
          }
        })
        this.multipleSelection = []
      } else {
        this.$message({
          message: "请选择要删除的行",
          type: 'error'
        });
      }
    },

    // 行选择变化
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 单元格样式
    myclass({row, columnIndex}) {
      if (row[columnIndex] && !row[columnIndex].sfcb && row[columnIndex].sfcb != null) {
        return "color: red";
      }
    },
    // 其他方法保持不变
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.getUsersArray({fenglishname: query});
      } else {
        this.userList = [];
      }
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
          addPackage(params).then(res => {
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

  .image-preview-area {
    margin-bottom: 10px;
  }

  .preview-images {
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
  }

  .image-count {
    font-size: 12px;
    color: #666;
    text-align: center;
    margin-bottom: 5px;
  }

  .no-image {
    color: #999;
    font-size: 12px;
    display: block;
    margin-bottom: 10px;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 5px;
  }

  .action-buttons .el-button {
    margin: 0 2px;
  }

  /* 图片预览对话框样式 */
  .image-preview-dialog .el-dialog__body {
    padding: 20px;
  }

  .carousel-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #f5f5f5;
  }

  .image-info {
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  }

  .no-images {
    text-align: center;
    padding: 40px;
    color: #999;
  }

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
    font-size: 14px;
    flex-direction: column;
  }

  .image-slot .el-icon-picture-outline {
    font-size: 32px;
    margin-bottom: 10px;
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

  /* 删除按钮样式 */
  .delete-img-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    opacity: 0.8;
  }

  .delete-img-btn:hover {
    opacity: 1;
  }

  .carousel-image-container {
    position: relative;
    height: 100%;
  }

  .image-description {
    text-align: center;
    margin-top: 10px;
    color: #666;
    font-size: 14px;
  }
</style>
