import { message } from 'ant-design-vue'

export const copy2clipboard = (text: string) => {
  message.success({ content: `已复制内容 "${text}" 到粘贴板` })
  navigator.clipboard.writeText(text)
}
