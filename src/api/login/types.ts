export interface UserLoginType {
  username?: string
  password: string,
  pin?: string,
  code: string,
  uuid: string
}

export interface UserType {
  username: string
  password: string
  role: string
  roleId: string
  roles?: any[]
  nickName: string
}

export interface UserLoginResultType {
  
}

export interface CodeType {
  uuid: string
  img: string
  captchaEnabled: boolean
}