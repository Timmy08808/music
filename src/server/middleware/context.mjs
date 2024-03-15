export const contextMiddleware = () => {
    return async (ctx, next) => {
        ctx.return = ({ code = 200, data = {}, msg = '成功' }) => {
            ctx.body = { code, data, msg }
        }
        await next()
    }
}