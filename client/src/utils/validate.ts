// utils/validate.ts

// ==================== 正则表达式常量 ====================

export const REGEX = {
  // 手机号（中国大陆）
  PHONE: /^1[3-9]\d{9}$/,
  
  // 邮箱
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // 身份证号（18位）
  ID_CARD: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  
  // 密码（8-20位，包含字母和数字）
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/,
  
  // 验证码（6位数字）
  CAPTCHA: /^\d{6}$/,
  
  // 中文姓名（2-10个汉字）
  CHINESE_NAME: /^[\u4e00-\u9fa5]{2,10}$/,
  
  // 金额（最多2位小数）
  AMOUNT: /^\d+(\.\d{1,2})?$/,
  
  // 正整数
  POSITIVE_INT: /^[1-9]\d*$/,
  
  // 座机号码（区号-号码）
  LANDLINE: /^0\d{2,3}-?\d{7,8}$/,
  
  // 邮政编码
  ZIP_CODE: /^[1-9]\d{5}$/,
  
  // URL
  URL: /^https?:\/\/[^\s/$.?#].[^\s]*$/i,
  
  // 日期格式（YYYY-MM-DD）
  DATE: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
} as const

// ==================== 基础验证函数 ====================

/**
 * 验证手机号
 */
export const isPhone = (phone: string): boolean => {
  return REGEX.PHONE.test(phone)
}

/**
 * 验证邮箱
 */
export const isEmail = (email: string): boolean => {
  return REGEX.EMAIL.test(email)
}

/**
 * 验证身份证号（包含校验位验证）
 */
export const isIdCard = (idCard: string): boolean => {
  if (!REGEX.ID_CARD.test(idCard)) return false
  
  // 校验位验证
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCard[i]) * weights[i]
  }
  
  return checkCodes[sum % 11].toLowerCase() === idCard[17].toLowerCase()
}

/**
 * 验证密码强度
 */
export const isValidPassword = (password: string): boolean => {
  return REGEX.PASSWORD.test(password)
}

/**
 * 获取密码强度等级（0-4）
 */
export const getPasswordStrength = (password: string): number => {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++
  return strength
}

// ==================== 酒店业务验证 ====================

/**
 * 验证搜索参数
 */
export const validateSearchParams = (params: {
  city?: string
  checkIn?: string
  checkOut?: string
}): { valid: boolean; message?: string } => {
  if (!params.city?.trim()) {
    return { valid: false, message: '请选择目的地' }
  }
  
  if (!params.checkIn || !params.checkOut) {
    return { valid: false, message: '请选择入住和离店日期' }
  }
  
  const checkIn = new Date(params.checkIn)
  const checkOut = new Date(params.checkOut)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (checkIn < today) {
    return { valid: false, message: '入住日期不能早于今天' }
  }
  
  if (checkOut <= checkIn) {
    return { valid: false, message: '离店日期必须晚于入住日期' }
  }
  
  const maxStay = 28 // 最长入住28天
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  if (nights > maxStay) {
    return { valid: false, message: `单次入住最长${maxStay}天` }
  }
  
  return { valid: true }
}

/**
 * 验证酒店信息（商户录入）
 */
export const validateHotelInfo = (info: {
  name?: string
  address?: string
  phone?: string
  starLevel?: number
  price?: number
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}
  
  if (!info.name?.trim() || info.name.length < 2) {
    errors.name = '酒店名称至少2个字符'
  }
  
  if (!info.address?.trim()) {
    errors.address = '请输入酒店地址'
  }
  
  if (info.phone && !isPhone(info.phone) && !REGEX.LANDLINE.test(info.phone)) {
    errors.phone = '请输入有效的联系电话'
  }
  
  if (!info.starLevel || info.starLevel < 1 || info.starLevel > 5) {
    errors.starLevel = '请选择正确的星级'
  }
  
  if (info.price === undefined || info.price < 0) {
    errors.price = '请输入有效的价格'
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * 验证订单信息
 */
export const validateOrderInfo = (info: {
  contactName?: string
  contactPhone?: string
  checkInDate?: string
  roomCount?: number
  guestCount?: number
}): { valid: boolean; message?: string } => {
  if (!info.contactName?.trim()) {
    return { valid: false, message: '请输入联系人姓名' }
  }
  
  if (!isPhone(info.contactPhone || '')) {
    return { valid: false, message: '请输入有效的手机号' }
  }
  
  if (!info.checkInDate) {
    return { valid: false, message: '请选择入住日期' }
  }
  
  if (!info.roomCount || info.roomCount < 1) {
    return { valid: false, message: '房间数量至少为1' }
  }
  
  if (!info.guestCount || info.guestCount < 1) {
    return { valid: false, message: '入住人数至少为1' }
  }
  
  // 一般规则：每间房最多住4人
  if (info.guestCount > info.roomCount * 4) {
    return { valid: false, message: '入住人数超出房间容量' }
  }
  
  return { valid: true }
}

// ==================== 表单验证器类（用于复杂表单） ====================

interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (value: any) => boolean | string
  message?: string
}

export class FormValidator {
  private rules: Record<string, ValidationRule[]>
  private errors: Record<string, string>

  constructor(rules: Record<string, ValidationRule[]>) {
    this.rules = rules
    this.errors = {}
  }

  validate(data: Record<string, any>): boolean {
    this.errors = {}
    
    for (const [field, rules] of Object.entries(this.rules)) {
      const value = data[field]
      
      for (const rule of rules) {
        // 必填验证
        if (rule.required && (value === undefined || value === null || value === '')) {
          this.errors[field] = rule.message || `${field}不能为空`
          break
        }
        
        // 跳过空值的后续验证（除非必填）
        if (!value && !rule.required) continue
        
        // 长度验证
        if (rule.min !== undefined && value.length < rule.min) {
          this.errors[field] = rule.message || `最少${rule.min}个字符`
          break
        }
        if (rule.max !== undefined && value.length > rule.max) {
          this.errors[field] = rule.message || `最多${rule.max}个字符`
          break
        }
        
        // 正则验证
        if (rule.pattern && !rule.pattern.test(String(value))) {
          this.errors[field] = rule.message || '格式不正确'
          break
        }
        
        // 自定义验证器
        if (rule.validator) {
          const result = rule.validator(value)
          if (result !== true) {
            this.errors[field] = typeof result === 'string' ? result : (rule.message || '验证失败')
            break
          }
        }
      }
    }
    
    return Object.keys(this.errors).length === 0
  }

  getErrors(): Record<string, string> {
    return this.errors
  }

  getFirstError(): string | null {
    const messages = Object.values(this.errors)
    return messages.length > 0 ? messages[0] : null
  }
}

// ==================== 使用示例 ====================

/*
// 定义验证规则
const hotelValidator = new FormValidator({
  name: [
    { required: true, message: '请输入酒店名称' },
    { min: 2, max: 50, message: '名称长度2-50个字符' }
  ],
  phone: [
    { required: true, message: '请输入联系电话' },
    { validator: (v) => isPhone(v) || '手机号格式不正确' }
  ],
  price: [
    { required: true, message: '请输入价格' },
    { validator: (v) => v > 0 || '价格必须大于0' }
  ]
})

// 使用
const isValid = hotelValidator.validate(formData)
if (!isValid) {
  console.log(hotelValidator.getFirstError())
}
*/

// ==================== 常用验证组合 ====================

/**
 * 快速验证对象（适用于简单场景）
 */
export const quickValidate = (
  data: Record<string, any>,
  checks: Array<{
    field: string
    rule: 'required' | 'phone' | 'email' | 'number' | 'date'
    message?: string
  }>
): string | null => {
  for (const check of checks) {
    const value = data[check.field]
    let valid = true
    
    switch (check.rule) {
      case 'required':
        valid = !!value && String(value).trim() !== ''
        break
      case 'phone':
        valid = isPhone(String(value))
        break
      case 'email':
        valid = isEmail(String(value))
        break
      case 'number':
        valid = !isNaN(Number(value))
        break
      case 'date':
        valid = !isNaN(Date.parse(String(value)))
        break
    }
    
    if (!valid) {
      return check.message || `${check.field}验证失败`
    }
  }
  
  return null
}