import { message } from 'ant-design-vue'

export const copy2clipboard = (text: string, hint?: string) => {
  message.success({ content: hint ?? `已复制内容 "${text}" 到粘贴板` })
  return navigator.clipboard.writeText(text)
}
