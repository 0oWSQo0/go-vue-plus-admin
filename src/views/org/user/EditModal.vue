<template>
  <Dialog v-model="open" :title="title" width="400">
    <Form :rules="rules" :schema="schema" @register="formRegister" />
    <template #footer>
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Regular } from '@/utils/validate'
import { listRoleApi } from '@/api/permission/role'
import { updateUserApi } from '@/api/org/user'
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import type { FormSchema } from '@/components/Form'

const { proxy } = getCurrentInstance() as any
const emits = defineEmits(['submit'])
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
const { required, lengthRange } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods

const open = ref(false)
const loading = ref(false)
const title = ref('')
const rules = ref<any>({
  username: [required(), lengthRange({ min: 4, max: 20 }), { pattern: Regular.Account_number(), message: '用户名账号以字母开头，只能包含字母、数字和下划线' }],
  roleId: [required()],
  realName: [required(), lengthRange({ min: 2, max: 20 })],
  password: [required(), lengthRange({ min: 8, max: 20 }), { pattern: Regular.checkPin(), message: '口令应包含字母、数字、特殊字符' }],
  checkPassword: [
    required(),
    {
      asyncValidator: async (_: any, value: any, callback: Function) => {
        const formData = await getFormData()
        if (formData.password !== value) {
          callback(new Error('两次输入的口令不一致'))
        }
        callback()
      }
    }
  ]
})
const schema = ref<FormSchema[]>([
  { field: 'realName', label: '用户昵称', component: 'Input', componentProps: { maxlength: 20 } },
  {
    field: 'roleId',
    label: '用户角色',
    component: 'TreeSelect',
    componentProps: {
      defaultExpandAll: true,
      checkStrictly: true
    },
    optionApi: async () => {
      const { data } = await listRoleApi({ pageSize: 100 })
      return data.list
    }
  },
  { field: 'username', label: '用户账号', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'password', label: '用户口令', component: 'InputPassword', componentProps: { maxlength: 20, strength: true } },
  { field: 'checkPassword', label: '确认口令', component: 'InputPassword', componentProps: { maxlength: 20, strength: true } },
  { field: 'status', value: 1, label: '账号状态', component: 'RadioButton', componentProps: { options: sys_normal_disable } },
  { field: 'remark', label: '备注信息', component: 'Input', componentProps: { maxlength: 100, type: 'textarea', showWordLimit: true, autosize: { minRows: 2 } } }
])

const reset = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}

const submit = async () => {
  const elFormExpose = await getElFormExpose()
  await elFormExpose?.validate()
  try {
    loading.value = true
    const formData = await getFormData()
    updateUserApi(formData)
    proxy.$modal.msgSuccess(`${unref(title)}成功`)
    open.value = false
    emits('submit')
  } finally {
    loading.value = false
  }
}

const show = async (row?: any) => {
  title.value = row ? '修改' : '新增'
  open.value = true
  reset()

  if (row) {
    await nextTick()
    setValues(row)
    const formData = await getFormData()
    console.log(formData)
    rules.value.password[0].required = false
    rules.value.checkPassword[0].required = false
  } else {
    rules.value.password[0].required = true
    rules.value.checkPassword[0].required = true
  }
}
defineExpose({ show })
</script>
