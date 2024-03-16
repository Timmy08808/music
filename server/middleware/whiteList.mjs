import { whiteList } from '../config/index.mjs'

export const whiteListMiddleware = () => {
    return async (ctx, next) => {
        let { referer } = ctx.header
        if (referer) {
            referer = referer.slice(0, referer.length - 1)
            if (!whiteList.includes(referer)) {
                ctx.return({ code: 405, msg: '拒绝访问，请联系管理员' })
                return
            }
        }
        await next()
    }
}