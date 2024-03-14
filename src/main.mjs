import fs from 'node:fs'
import path from 'node:path'
import axios from 'axios'

const resolve = str => path.resolve('./', str)

const writeSong = () => {
    const dirPath = 'src/mp3'
    let dir = fs.readdirSync(resolve(dirPath))
    dir = dir.map(name => ({ name })).filter(k => /\.mp3/.test(k.name))
    fs.writeFileSync(resolve(dirPath) + '/list.ts', `export const list = ${JSON.stringify(dir)}`)
    console.log('完成 === 歌曲数量：', dir.length)
}
writeSong()

const getSong = async () => {
    const name = '错错错'
    const url = `https://dataiqs.com/api/kgmusic/?msg=${name}&n=0`
    const { data } = await axios.get(url)
    console.log("🚀 ~ getSong ~ data:", data)
}

// getSong()