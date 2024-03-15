import path from 'node:path'

export const resolve = str => {
    const rootPath = 'server'
    return path.resolve(rootPath, str)
}