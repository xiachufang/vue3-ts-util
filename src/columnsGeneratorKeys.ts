import type { ColumnProps } from './typedef'

/**
 * 生成antd表格列的主键
 * @param col
 */
export const generateKey = <T extends ColumnProps>(col: T): T => {
  return col.key ? col : {
    ...col,
    key: col.slots
      ? `_s_${col.slots.customRender}`
      : `_${(col.dataIndex || col.title)}_`
  }
}

export const patchGenerateKey = <T extends ColumnProps>(cols: T[], withProps: Partial<ColumnProps> = {}) => {
  return cols.map(generateKey).map(v => ({ ...v, ...withProps }))
}
