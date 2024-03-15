import { whiteList } from '../config/index.mjs'

export const whiteListMiddleware = () => {
    return async (ctx, next) => {
        let { referer } = ctx.header
        referer = referer.slice(0, referer.length - 1)
        if (!whiteList.includes(referer)) {
            ctx.return({ code: 498, msg: '域名不在白名单内，请联系管理员' })
            return
        }
        await next()
    }
}