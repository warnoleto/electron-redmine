import fs from 'fs'

const watchers = []

const closeAll = () => {
  for (let w of watchers) {
    w.close()
  }
  watchers.length = 0
}

const registerAll = (list, callback) => {
  closeAll()
  for (let item of list) {
    console.log(`watching folder: ${item.path}`)
    watchers.push(fs.watch(item.path, {recursive: true}, callback))
  }
}

export default {
  watchers,
  closeAll,
  registerAll
}
