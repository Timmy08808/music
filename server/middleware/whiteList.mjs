import { whiteList } from '../config/index.mjs'

export const whiteListMiddleware = () => {
    return async (ctx, next) => {
        const { origin } = ctx.header
        if (!whiteList.includes(origin)) {
            ctx.return({ code: 498, msg: '域名不在白名单内，请联系管理员' })
            return
        }
        await next()
    }
}