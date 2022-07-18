import * as fs from 'fs/promises'
import path from 'path'

const reg = /<!--docinsert-->(.+)<!--docinsert-->/s
const readmeFilename = './README.md'
export const genContents = async () => {
  const docProfiles = new Array<{ contents: string, desc: string, fileName: string }>()
  const files = await fs.readdir('./doc')
  for (const fileName of files) {
    const file = (await fs.readFile(path.join('./doc', fileName))).toString()
    const [_, contents, desc] = /^((?:.|\n)*)?desc:(.*)?\n/.exec(file)!
    docProfiles.push({
      contents: contents
        .trim()
        .split('\n')
        .map(line => line.replace(/]\((.*)\)/, (_, url) => `](./doc/${fileName}` + url + ')'))
        .join('\n'),
      desc,
      fileName
    })
  }
  const readme = (await fs.readFile(readmeFilename)).toString()
  const buildGeneralDoc = () => {
    return docProfiles.map((doc) => {
      return `# ${doc.desc}
${doc.contents}
`
    }).join('\n')
  }
  const newReadme = readme.replace(reg,
`<!--docinsert-->
${buildGeneralDoc()}
<!--docinsert-->`)
  await fs.writeFile(readmeFilename, newReadme)
}
