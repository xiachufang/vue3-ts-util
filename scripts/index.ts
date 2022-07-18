import { importOptimize } from './importOptimize'
import { startGenVueType } from './generateVueType'
import { devWatch } from './watch'
import { genContents } from './genContents'
const { argv } = process
const type = argv?.[2].substr(2)

switch (type) {
  case 'gen-vue-type':
    startGenVueType()
    break
  case 'import-optimize':
    importOptimize('es/src')
    break
  case 'dev-watch':
    devWatch()
    break
  case 'gen-contents':
    genContents()
    break
}
