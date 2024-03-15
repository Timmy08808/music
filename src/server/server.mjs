import { resolve } from 'node:path'
import Koa from 'koa'
import koastatic from 'koa-static'
import cors from '@koa/cors'

import router from './router/index.mjs'


const server = () => {
    const port = 3376
    const app = new Koa()

    app.
    use(cors()).
    use(koastatic(resolve('src/server/public'), {})).
    use(router.routes()).
    use(router.allowedMethods()).
    listen(port, () => console.log("🚀 ~ server ~ run: http://localhost:" + port))
}
server()