import fs from 'node:fs'
import path from 'node:path'
import axios from 'axios'
import Koa from 'koa'
import koastatic from 'koa-static'
import Router from '@koa/router'
import cors from '@koa/cors'

const resolve = str => path.resolve('./', str)

const server = () => {
    const port = 3376
    const app = new Koa()
    const router = new Router()
    router.get('/', async ctx => {
        ctx.body = 'koa +++'
    })
    router.get('/api/mp3/list', async ctx => {
        const dirPath = 'src/public/mp3'
        const dir = fs.readdirSync(resolve(dirPath))
        const data = dir.filter(k => /\.mp3/.test(k)).map(name => ({ name: name.replace(/\.mp3/, ''), url: `/mp3/${name}` }))
        // fs.writeFileSync(resolve(dirPath) + '/list.ts', `export const list = ${JSON.stringify(dir)}`)
        ctx.body = {
            code: 200,
            data
        }
    })

    app.
    use(cors()).
    use(koastatic(resolve('src/public'), {})).
    use(router.routes()).
    use(router.allowedMethods()).
    
    listen(port, () => console.log("🚀 ~ server ~ run: http://localhost:" + port))

}
server()

const getSong = async () => {
    const name = '错错错'
    const url = `http://localhost:1337/api/mp3s`
    const res = await axios.get(url, {
        headers: {
            'Authorization': 'Bearer f4095de44ffba25ef066a852be78d8a7c1990aee93c767c42598c7e6f38109d0f9033c01466b8a3e398ebabdee4b81d1c38f6672803e41efa753e264e8ae36ee108c5aac0f602ed66ba25d3727c733a909e05c946209d27d94b282d070a5781e044a9004c87e4c49427365e7c29c685af28333eeffd811383a757bffe8357847'
        }
    }).then(res => res.data, err => err.toString())
    console.log("🚀 ~ getSong ~ data:", res.data)
}

// getSong()