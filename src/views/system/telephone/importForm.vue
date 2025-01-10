<template>
  <div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="75%" v-dialogDrag append-to-body>
      <el-row>
        <el-alert title="消息提示的文案" type="info" class="text">
        </el-alert>

      </el-row>
      <el-button type="primary" @click="uploadFile">点击上传</el-button>
      <el-button @click="downloadTemplate">下载模板</el-button>
    </el-dialog>

    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url"
        :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess"
        :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>

        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import * as telephoneAPI from '@/api/system/telephone'
import { getBaseHeader } from "@/utils/request";
export default {
  data() {
    return {
      selectedFile: null,
      dialogVisible: false,
      dialogTitle: '批量导入',
      templateLoading: false,
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/teleconference/import-excel'
      },
    }
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    async downloadTemplate() {
      try {
        this.templateLoading = true
        const data = await telephoneAPI.exportMeetingTemplate()
        this.$download.excel(data, '电话会议模板.xls');
      } catch (err) {

      } finally {
        this.templateLoading = false
      }
    },

    async uploadFile() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError(response.msg)
        return;
      }
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      // 拼接提示语
      let data = response.data;
      let text = '创建成功数量：' + data.createUsernames.length;
      for (const username of data.createUsernames) {
        text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + username;
      }
      text += '<br />更新成功数量：' + data.updateUsernames.length;
      for (const username of data.updateUsernames) {
        text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + username;
      }
      text += '<br />更新失败数量：' + Object.keys(data.failureUsernames).length;
      for (const username in data.failureUsernames) {
        text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + username + '：' + data.failureUsernames[username];
      }
      this.$alert(text, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  }
}
</script>
<style>
.text {
  margin-bottom: 20px;
}
</style>
