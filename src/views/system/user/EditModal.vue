<script setup lang="ts">
import { Regular } from '@/utils/validate'
import { getUser, updateUser, addUser } from '@/api/system/user'
import { sm3 } from 'sm-crypto'
import { useValidator } from '@/hooks/useValidator'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
const emits = defineEmits(['submit'])
const { required, lengthRange } = useValidator()

const open = ref(false)
const formRef = ref()
const loading = ref(false)
const title = ref('')
const roleOptions = ref<any[]>([])
const form = ref<any>({})
const rules = ref<any>({
  userName: [required(), lengthRange({ min: 4, max: 20 }), { pattern: Regular.Account_number(), message: '用户名账号以字母开头，只能包含字母、数字和下划线' }],
  roleIds: [required()],
  nickName: [required(), lengthRange({ min: 2, max: 20 })],
  password: [required(), lengthRange({ min: 8, max: 20 }), { pattern: Regular.checkPin(), message: '口令应包含字母、数字、特殊字符' }],
  checkPassword: [
    required(),
    lengthRange({ min: 8, max: 20 }),
    { pattern: Regular.checkPin(), message: '确认口令应包含字母、数字、特殊字符' },
    {
      validator: (_, val, callback) => {
        if (form.value.password !== val) {
          callback(new Error('两次输入的口令不一致'))
        } else {
          callback()
        }
      }
    }
  ]
})
function reset() {
  form.value = {
    status: '0',
    roleIds: []
  }
  proxy.resetForm('formRef')
}

const submit = async () => {
  await formRef.value.validate()
  try {
    const obj = {
      ...form.value,
      roleIds: [form.value.roleIds],
      password: form.value.userId ? form.value.password : sm3(form.value.password)
    }
    form.value.userId ? await updateUser(obj) : await addUser(obj)
    proxy.$modal.msgSuccess(`${title.value}成功`)
    open.value = false
    emits('submit')
  } finally {
    loading.value = false
  }
}

const init = async (userId: number | string) => {
  const res: any = await getUser(userId)
  roleOptions.value = res.roles
  if (userId != 0) {
    form.value = res.data
    form.value.roleIds = res.roleIds?.[0]
  }
}

const show = async (userId?: number) => {
  reset()
  title.value = userId ? '修改' : '新增'
  await init(userId ?? '')
  open.value = true
}
defineExpose({ show })
</script>

<template>
  <Dialog v-model="open" :title="title" width="400">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="20" />
      </el-form-item>
      <el-form-item label="用户角色" prop="roleIds">
        <el-select v-model="form.roleIds" placeholder="请选择用户角色">
          <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" :disabled="item.status == 1" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!form.userId" label="用户账号" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入用户账号" maxlength="20" />
      </el-form-item>
      <el-form-item v-if="!form.userId" label="用户口令" prop="password">
        <el-input v-model="form.password" placeholder="请输入用户口令" type="password" show-password autocomplete="new-password" maxlength="20" />
      </el-form-item>
      <el-form-item v-if="!form.userId" label="确认口令" prop="checkPassword">
        <el-input v-model="form.checkPassword" placeholder="请输入确认口令" type="password" show-password autocomplete="new-password" maxlength="20" />
      </el-form-item>
      <el-form-item label="账号状态">
        <el-radio-group v-model="form.status">
          <el-radio-button v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input v-model="form.remark" type="textarea" show-word-limit maxlength="100" placeholder="请输入备注信息" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
    </template>
  </Dialog>
</template>
