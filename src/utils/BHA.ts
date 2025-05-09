import { ElMessageBox } from 'element-plus'
import { SM4EcbCrypter } from './SM4'
import { Base64 } from 'js-base64'

/**
 * 参数处理
 * @param {*} params  参数
 */
function tansParams(params: any) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    const part = encodeURIComponent(propName) + '='
    if (value !== null && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && typeof value[key] !== 'undefined') {
            const params = propName + '[' + key + ']'
            const subPart = encodeURIComponent(params) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}

enum SKFInterface {
  EnumDev = '01000001', // 枚举设备
  OpenDev = '01000002', // 打开设备
  CloseDev = '01000003', // 关闭设备
  ModifyLabel = '01000004', // 修改设备标签
  DevInfo = '01000005', // 获取设备信息
  DevState = '01000006', // 获取设备状态
  DevAuth = '02000003', // 设备认证
  ChangePIN = '02000004', // 修改PIN码
  PinInfo = '02000005', // 获取PIN信息
  CheckPIN = '02000006', // 操作员登录/验证PIN码
  UnlockOperator = '02000007', // 解锁操作员PIN码
  Logout = '02000008', // 注销登录
  EnumDevApp = '03000001', // 枚举应用
  CreateApp = '03000002', // 创建应用
  DelApp = '03000003', // 删除应用
  OpenApp = '03000004', // 打开应用
  CreateFile = '04000002', // 创建文件
  DelFile = '04000003', // 删除文件
  EnumFile = '04000004', // 枚举文件
  FileInfo = '04000005', // 获取文件信息
  ReadFile = '04000006', // 读取文件
  WriteFile = '04000007', // 写入文件
  CreateContainer = '05000001', // 创建容器
  DelContainer = '05000002', // 删除容器
  EnumContainer = '05000003', // 枚举容器
  OpenContainer = '05000004', // 打开容器
  GenerateRandom = '06000002', // 生成随机数
  ExportPublicKey = '06000017', // 导出公钥
  ImportPublicKey = '06000019', // 导入明文密钥
  SymmetricCryptoA = '0600001A', // 对称加密A
  SymmetricCryptoB = '0600001B', // 对称加密A
  GenerateKey = '0600000B', // 生成密钥
  SM3Hash = '06000022', // SM3 hash
  SM3Digest = '06000023', // SM3 摘要
  SM2Sign = '0600000D', // SM2 签名
  sm2Encrypt = '06000010', // SM2 加密
  GenerateCertReq = '07000001' // 生成证书请求
}

const url = 'http://127.0.0.1:12345/do'
const service = async (params: any) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tansParams(params)
    })
    return await res.json()
  } catch (e) {
    ElMessageBox.alert('未检测到UKEY服务或参数错误', '系统提示', { type: 'error' })
  }
}

/**
 * 打开设备
 * @param index 要打开第几个设备
 * @returns 设备句柄
 */
export const openDevice = async ({ index = 0 }: { index?: number }) => {
  const { devList } = await service({ order: SKFInterface.EnumDev })
  if (!devList || devList.length === 0) {
    return Promise.reject({ msg: '未检测到UKEY', detail: '枚举设备失败或未检测到设备' })
  }
  const { hdev } = await service({ order: SKFInterface.OpenDev, devname: devList[index] })
  if (!hdev) {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '打开设备失败' })
  }
  return Promise.resolve({ hdevice: hdev, devname: devList[index] })
}

/**
 * 打开应用
 * @param hdevice 设备句柄
 * @param appName 应用名称
 * @returns
 */
export const openApp = async ({ hdevice, appName }) => {
  const { appList } = await service({ order: SKFInterface.EnumDevApp, hdevice })
  if (!appList) {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '枚举应用失败' })
  }
  if (!appList.includes(appName)) {
    return Promise.reject({ msg: '非法的KEY', detail: '应用不存在' })
  }
  const { happ } = await service({ order: SKFInterface.OpenApp, hdevice, appName })
  if (!happ) {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '打开应用失败' })
  }
  return Promise.resolve(happ)
}

/**
 * 创建应用
 * @param hdevice 设备句柄
 * @param appName 应用名称
 * @param userPin 操作员PIN码
 * @returns
 */
export const createApp = async ({ hdevice, appName, userPin }) => {
  const { appList } = await service({ order: SKFInterface.EnumDevApp, hdevice })
  if (!appList) {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '枚举应用失败' })
  }
  if (appList.length === 3 && !appList.includes(appName)) {
    return Promise.reject({ msg: 'UKEY应用空间不足，请联系管理员', detail: '应用空间不足' })
  }
  if (appList.includes(appName)) {
    // 设备认证(删除操作时需要先对设备进行认证才可继续操作)
    await authApp({ hdevice })
    const delRes = await service({ order: SKFInterface.DelApp, hdevice, appName })
    if (delRes.rev != '0') {
      return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '删除应用失败' })
    }
  } else {
    // 设备认证
    await authApp({ hdevice })
  }
  const createRes = await service({ order: SKFInterface.CreateApp, hdevice, appName, adminPin: 11111111, adminRetry: 5, userPin, userRetry: 5, createFileRights: 0x00000010 })
  if (createRes.rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '创建应用失败' })
  }
  return Promise.resolve()
}
const authApp = async ({ hdevice }) => {
  const { ranData } = await service({ order: SKFInterface.GenerateRandom, hdevice, len: 8 })
  const authData = SM4EcbCrypter.encrypt(ranData, '1234567812345678')
  const { rev } = await service({ order: SKFInterface.DevAuth, hdevice, authData })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '设备认证失败' })
  }
}

/**
 * 操作员/管理员登录
 * @param happlication 应用句柄
 * @param pin PIN码
 * @param pinType PIN类型，操作员 1，管理员 0
 * @returns
 */
export const checkPin = async ({ pin, pinType = 1, happlication }: { pin: string; pinType?: number; happlication: string }) => {
  const { rev, retryCount } = await service({ order: SKFInterface.CheckPIN, happlication, pinType, pin })
  if (rev === '0') {
    return Promise.resolve()
  }
  if (rev === '167772197') {
    // 操作员权限已锁定，不可再登陆
    return Promise.reject({ code: SKFInterface.CheckPIN, msg: '用户权限已锁定', detail: '重试次数过多' })
  }
  if (retryCount) {
    // 获取 PIN 码验证重试次数
    const count = retryCount.slice(retryCount.indexOf('(') + 1, retryCount.indexOf(')'))
    return Promise.reject({ msg: `PIN码验证失败，剩余尝试次数：${count}次` })
  }
  return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '验证PIN码失败' })
}

/**
 * 重置PIN码
 * @param happlication 应用句柄
 * @param newPin 新PIN码
 * @returns
 */
export const resetPin = async ({ happlication, newPin }: { happlication: string; newPin: string }) => {
  const { rev } = await service({ order: SKFInterface.UnlockOperator, happlication, adminPin: 11111111, newPin })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '重置PIN码失败' })
  }
  return Promise.resolve()
}

/**
 * 修改操作员PIN码
 * @param happlication 应用句柄
 * @param oldPin 旧PIN码
 * @param newPin 新PIN码
 * @returns
 */
export const changePin = async ({ happlication, oldPin, newPin }) => {
  const { rev } = await service({ order: SKFInterface.ChangePIN, happlication, pinType: 1, oldPin, newPin })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '修改PIN码失败' })
  }
  return Promise.resolve()
}

/**
 * 获取设备状态
 * @param devname 设备名称
 * @returns
 */
export const getKeyStatus = async ({ devname }: { devname: string }) => {
  const { rev, devState } = await service({ order: SKFInterface.DevState, devname })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '获取设备状态失败' })
  }
  return Promise.resolve(devState === '1')
}

/**
 * 获取设备信息
 * @param hdevice 设备句柄
 * @returns
 */
export const getKeyInfo = async ({ hdevice }) => {
  const { rev, devInfo } = await service({ order: SKFInterface.DevInfo, hdevice })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '获取设备信息失败' })
  }
  return Promise.resolve(devInfo)
}

/**
 * 生成随机数
 * @param len 生成的随机数长度
 * @returns
 */
export const generateRandom = async ({ hdevice, len = 16 }: { hdevice: string; len?: number }) => {
  const { ranData } = await service({ order: SKFInterface.GenerateRandom, hdevice, len })
  if (!ranData) {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '生成随机数失败' })
  }
  return Promise.resolve(ranData)
}

/**
 * 打开容器
 * @param hdevice 设备句柄
 * @param happlication 应用句柄
 * @param containerName 容器名称
 * @returns
 */
export const openContainer = async ({ happlication, containerName }) => {
  const enumContainerRes = await service({ order: SKFInterface.EnumContainer, happlication })
  if (enumContainerRes.rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '枚举容器失败' })
  }
  if (!enumContainerRes.containerList.includes(containerName)) {
    const { rev } = await service({ order: SKFInterface.CreateContainer, happlication, containerName })
    if (rev != '0') {
      return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '创建容器失败' })
    }
  }
  const { rev, hcontainer } = await service({ order: SKFInterface.OpenContainer, happlication, containerName })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '打开容器失败' })
  }
  return Promise.resolve(hcontainer)
}

/**
 * 生成证书请求文件
 * 会重新生成公私钥对
 * @param hdevice 设备句柄
 * @param hcontainer 容器句柄
 * @param szCN 证书CN
 * @returns
 */
export const generateCSR = async ({ hdevice, hcontainer, szCN }) => {
  const { rev, csr } = await service({ order: SKFInterface.GenerateCertReq, hdevice, hcontainer, szCN, szOU: '', szO: '', szS: '', szL: '' })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '生成证书请求失败' })
  }
  return Promise.resolve(csr)
}

export const enumFile = async ({ happlication }) => {
  const { filelist } = await service({ order: SKFInterface.EnumFile, happlication })
  return Promise.resolve(filelist || [])
}
export const writeFile = async ({ happlication, filename, data }) => {
  const fileData = encodeURIComponent(JSON.stringify(data))
  const fileList = await enumFile({ happlication })
  if (fileList.includes(filename)) {
    await deleteFile({ happlication, filename })
  } else {
    await createFile({ happlication, filename, filesize: fileData.length })
  }
  const { rev } = await service({ order: SKFInterface.WriteFile, happlication, filename, offset: 0, data: window.btoa(fileData) })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '写入文件失败' })
  }
  return Promise.resolve()
}
export const deleteFile = async ({ happlication, filename }) => {
  const { rev } = await service({ order: SKFInterface.DelFile, happlication, filename })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '删除文件失败' })
  }
  return Promise.resolve()
}
export const createFile = async ({ happlication, filename, filesize }) => {
  const { rev } = await service({ order: SKFInterface.CreateFile, happlication, filename, filesize, readrights: 255, writerights: 255 })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '创建文件失败' })
  }
  return Promise.resolve()
}
/**
 * 获取文件信息
 * @param happlication 应用句柄
 * @param filename 文件名
 * @returns
 */
const getFileInfo = async ({ happlication, filename }) => {
  const { rev, fileInfo } = await service({ order: SKFInterface.FileInfo, happlication, filename })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '获取文件信息失败' })
  }
  return Promise.resolve(fileInfo)
}
/**
 * 读取文件
 * @param happlication 应用句柄
 * @param filename 文件名
 * @returns
 */
export const readFile = async ({ happlication, filename }) => {
  const fileInfo = await getFileInfo({ happlication, filename })
  const { rev, data } = await service({ order: SKFInterface.ReadFile, happlication, filename, offset: 0, size: fileInfo.filesize })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '读取文件失败' })
  }
  return Promise.resolve(data)
}

/**
 * sm2签名
 */
export const sm2Sign = async ({ hcontainer, plaindata }) => {
  const { rev, eccsignatureblob } = await service({ order: SKFInterface.SM2Sign, hcontainer, plaindata })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: 'sm2签名失败' })
  }
  return Promise.resolve(eccsignatureblob)
}
/**
 * sm2外部公钥加密
 * @param param0
 * @returns
 */
export const sm2Encrypt = async ({ hdevice, eccpublickeyblob, plaindata }) => {
  const { rev, eccsignatureblob } = await service({ order: SKFInterface.sm2Encrypt, hdevice, plaindata, eccpublickeyblob })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: 'sm2加密失败' })
  }
  return Promise.resolve(eccsignatureblob)
}

export const sm3 = async ({ hdevice, hcontainer, indata, withPublicKey = false, id = 'null' }: { hdevice: string; hcontainer: string; indata: string; withPublicKey?: boolean; id?: string }) => {
  let eccpublickeyblob = 'null'
  if (withPublicKey) {
    const res = await service({ order: SKFInterface.ExportPublicKey, hcontainer, signflag: 1 })
    eccpublickeyblob = res.publickeyblob
    const arr: any[] = []
    for (const ch of Base64.atob(eccpublickeyblob)) {
      arr.push(ch.codePointAt(0))
    }
  }
  const { hhash } = await service({ order: SKFInterface.SM3Hash, hdevice, algid: 1, eccpublickeyblob, id })
  const { digest } = await service({ order: SKFInterface.SM3Digest, hhash, indata })
  const arr: any = []
  for (const ch of Base64.atob(digest)) {
    arr.push(ch.codePointAt(0))
  }
  console.log('sm3', arr)
  return Promise.resolve(digest)
}
/**
 * sm4对称加密
 * 只需打开设备即可使用
 * @param hdevice 设备句柄
 * @param key 密钥(非必填)
 * @param plain 明文数据(base64)
 * @returns
 */
export const sm4 = async ({ hdevice, key, plain }: { hdevice: string; key?: string; plain: string }) => {
  // 导入密钥
  const { hkey } = await service({ order: SKFInterface.ImportPublicKey, hdevice, key, algid: 1025 })
  await service({ order: SKFInterface.SymmetricCryptoA, hkey, iv: null, paddingtype: 1 })
  const { rev, encrypt } = await service({ order: SKFInterface.SymmetricCryptoB, hkey, plain })
  if (rev != '0') {
    return Promise.reject({ msg: 'UKEY发生错误，请联系管理员', detail: '对称加密失败' })
  }
  return Promise.resolve(encrypt)
}
