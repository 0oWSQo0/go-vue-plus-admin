import { saveAs } from 'file-saver'
import { blobValidate } from '@/utils/ryUtils'
import { ElMessage } from 'element-plus'
import request from '@/axios'

export default {
  async downloadGet({ url, params, fileName }: { url: string; params?: any; fileName?: string }) {
    const res: any = await request.get({ url, params, responseType: 'blob' })
    const isBlob = blobValidate(res.data)
    if (isBlob) {
      const blob = new Blob([res.data])
      const name = res.headers['content-disposition'] ? res.headers['content-disposition'].split('filename=')[1] : fileName
      saveAs(blob, name)
    } else {
      this.printErrMsg(res.data)
    }
  },
  async downloadPost({ url, data, fileName }: { url: string; data?: any; fileName?: string }) {
    const res: any = await request.post({ url, data, responseType: 'blob' })
    const isBlob = blobValidate(res.data)
    if (isBlob) {
      const blob = new Blob([res.data])
      const name = res.headers['content-disposition'] ? res.headers['content-disposition'].split('filename=')[1] : fileName
      saveAs(blob, name)
    } else {
      this.printErrMsg(res.data)
    }
  },
  async printErrMsg(data: any) {
    const resText = await data.text()
    const rspObj = JSON.parse(resText)
    const errMsg = rspObj.msg || rspObj.message || '系统未知错误，请反馈给管理员'
    ElMessage.error(errMsg)
  }
}
