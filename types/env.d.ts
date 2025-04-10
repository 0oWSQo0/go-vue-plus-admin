/// <reference types="vite/client" />
import { addDateRange, handleTree, resetForm, selectDictLabel, selectDictLabels } from '@/utils/ryUtils'
import modal from '@/plugins/ryTools/modal'
import download from '@/plugins/ryTools/download'

declare module '*.vue' {
  import { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
