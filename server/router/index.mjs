import fs from 'node:fs'
import { resolve } from 'node:path'

import axios from 'axios'
import Router from '@koa/router'

const router = new Router()

router.get('/', async ctx => {
    ctx.body = 'hello word !'
})

router.get('/api/mp3/list', async ctx => {
    const names = fs.readdirSync(resolve( 'server/public/mp3'))
    const data = names.filter(k => /\.mp3/.test(k)).map(name => ({ name: name.replace(/\.mp3/, ''), url: `/mp3/${name}` }))
    ctx.return({ data })
})

// https://www.bilibili.com/read/cv15587325/ // 免费网易云api
const baseUrl = 'http://music.cyrilstudio.top'
router.get('/api/threelist', async ctx => {
    const { keywords } = ctx.query
    const { data: { result } } = await axios.get(`${baseUrl}/search?keywords=${keywords}`)
    ctx.return({ data: result })
})

router.get('/api/threedetail', async ctx => {
    const { id } = ctx.query
    const { data: { data } } = await axios.get(`${baseUrl}/song/url?id=${id}`)
    ctx.return(data)
})

export default router