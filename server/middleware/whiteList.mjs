import { whiteList } from '../config/index.mjs'

export const whiteListMiddleware = () => {
    return async (ctx, next) => {
        let { referer } = ctx.header
        referer = referer.slice(0, referer.length - 1)
        if (!whiteList.includes(referer)) {
            ctx.return({ code: 498, msg: '拒绝访问，请联系管理员' })
            return
        }
        await next()
    }
}