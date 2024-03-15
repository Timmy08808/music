import cluster from 'node:cluster'
import { availableParallelism } from 'node:os'
import Koa from 'koa'
import koastatic from 'koa-static'
import cors from '@koa/cors'

import router from './router/index.mjs'
import { contextMiddleware } from './middleware/context.mjs'
import { whiteListMiddleware } from './middleware/whiteList.mjs'
import { resolve } from './utils/index.mjs'

const server = () => {
    const port = 3376
    const app = new Koa()

    app.
    use(contextMiddleware()).
    use(whiteListMiddleware()).
    use(cors()).
    use(koastatic(resolve('public'))).
    use(router.routes()).
    use(router.allowedMethods()).
    listen(port, () => console.log("🚀 ~ server ~ run: http://localhost:" + port))
}

const startCluster = () => { // 集群
    if (cluster.isPrimary) {
        const numCpus = availableParallelism()
        console.log("🚀 ~ startCluster ~ numCpus:", numCpus)
        for (let i = 0; i < numCpus; i ++) {
            cluster.fork()
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log("🚀 ~ cluster.on exit ~ worker died:", worker.process.pid)
        })
    } else {
        server()
    }
}

const startServer = () => {
    const { ENV } = process.env
    if (ENV === 'dev') {
        server()
    }
    if (ENV === 'pro') {
        startCluster()
    }
}

// 音乐下载
// https://tool.liumingye.cn/music/#/
startServer()