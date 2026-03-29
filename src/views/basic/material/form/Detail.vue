<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" :size="'mini'"  label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'物料编码'" prop="fgender">
            <el-select style="width: 100%" v-model="form.fgender" placeholder="请选择">
              <el-option
                v-for="(item,index) in levelFormat"
                :key="index"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'物料名称'" prop="finvoice">
            <el-input v-model="form.finvoice"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'物料规格'">
            <el-input v-model="form.fcontractnumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'供应商'" prop="fgender">
            <el-select style="width: 100%" v-model="form.fgender" placeholder="请选择">
              <el-option
                v-for="(item,index) in levelFormat"
                :key="index"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24" style="text-align: center">
          <el-form-item :label="'图片'">
            <el-upload
              :action="fileUrl"
              list-type="picture-card"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              :headers="headers"
              :data="imgData"
              :limit="1"
              name="imgS"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :class="{hide:hideUpload}"
              :on-preview="handlePictureCardPreview"
              :on-change="handleChange"
              :file-list="fileList"
              ref="upload"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" append-to-body size="tiny">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" style="text-align:center;">
      <el-button type="primary" @click="saveData('form')">保存</el-button>
    </div>
  </div>
</template>

<script>import {addTcontract} from '@/api/basic/index'
import {
  getToken
} from '@/utils/auth'
export default {
  props: {
    listInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      headers: {
        'authorization': getToken('wcrx'),
      },
      fileUrl: '',
      imgData: {},
      images: [],
      hideUpload: false,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      limitCount: 1,
      form: {
        fcustom: null,
        finvoice: null,
        fcontractnumber: null,
        fcontractnature: null,
        fpaymentrules: null,
        fpaymentterm: null,
        fwarranty: null,
        frefundregulations: null,
        feffectivedate: null,
        fexpiringdate: null,
      },
      rules: {
        fcustom: [
          {required: true, message: '请输入', trigger: 'blur'}
        ], finvoice: [
          {required: true, message: '请输入', trigger: 'blur'}
        ], fname: [
          {required: true, message: '请输入', trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    if (this.listInfo) {
      this.form = this.listInfo
    }
  },
  methods: {
    saveData(form) {
      this.$refs[form].validate((valid) => {
        // 判断必填项
        if (valid) {
          addTcontract(this.form).then(res => {
            this.$emit('hideDialog', false)
            this.$emit('uploadList')
          })
        } else {
          return false
        }
      })
    },
    //上传失败事件
    uploadError(res) {
      console.log(res)
      this.$message({
        message: res.msg,
        type: "warning"
      });
      this.$emit('uploadList')
    },
    //上传成功事件
    uploadSuccess(res, file, fileList) {
      file.name = res.data;
      this.form.posterPhoto = res.data
      this.$message({
        message: res.msg,
        type: "success"
      });
      this.$emit('uploadList')
    },
    //删除图片
    handleRemove(file, fileList) {
      let array = this.fileList;
      let img =file.url.split(this.$store.state.user.url+'/movie/uploadFiles/image/')[1]
      array.forEach((item,index)=>{
        if (item.url.split(this.$store.state.user.url+'/movie/uploadFiles/image/')[1] == img) {
          array.splice(index, 1);
        }
      })
      this.$emit('uploadList')
      this.form.posterPhoto= null
      this.hideUpload = false
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleChange(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount;
    },
  }
}
</script>
