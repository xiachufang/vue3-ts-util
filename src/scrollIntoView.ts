/**
  * 滚动目标dom到指定范围
  * @param selectedDom 目标dom ，元素或者选择器
  */
export const scrollIntoView = (selectedDom: HTMLElement | string): void => {
  if (typeof selectedDom === 'string') {
    return scrollIntoView(document.querySelector(selectedDom) as HTMLElement)
  }
  // @see https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoViewIfNeeded
  if ((selectedDom as any).scrollIntoViewIfNeeded) { // 体验更好,但不是标准
    (selectedDom as any).scrollIntoViewIfNeeded(false)
  } else {
    selectedDom.scrollIntoView()
  }
}
