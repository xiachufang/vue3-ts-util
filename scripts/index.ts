import { startGenVueType } from './generateVueType'
import { devWatch } from './watch'
import { genContents } from './genContents'
import { playground } from './playground'

const { argv } = process
const type = argv?.[2]?.substr(2)

switch (type) {
  case 'gen-vue-type':
    startGenVueType()
    break
    break
  case 'dev-watch':
    devWatch()
    break
  case 'gen-contents':
    genContents()
    break
  case 'playground':
    playground()
    break
}
