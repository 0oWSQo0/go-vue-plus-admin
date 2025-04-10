import modal from './modal'
import download from './download'
import type { App } from 'vue'
import { resetForm, useDict, addDateRange, selectDictLabel, selectDictLabels, handleTree } from '@/utils/ryUtils'

export default function installRyPlugins(app: App<Element>) {
  app.config.globalProperties.useDict = useDict
  app.config.globalProperties.resetForm = resetForm
  app.config.globalProperties.handleTree = handleTree
  app.config.globalProperties.addDateRange = addDateRange
  app.config.globalProperties.selectDictLabel = selectDictLabel
  app.config.globalProperties.selectDictLabels = selectDictLabels
  // 模态框对象
  app.config.globalProperties.$modal = modal
  // 下载文件
  app.config.globalProperties.$download = download
}
