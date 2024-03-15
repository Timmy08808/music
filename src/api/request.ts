import axios from 'axios'

export const baseURL = (import.meta as any).env.VITE_API_URL

const instance = axios.create({
    baseURL,
    timeout: 20000
})

const req = method => {
    return (url, data = {}, config = {}) => {
        return instance({
            method,
            url,
            data: method === 'post' ? data : {},
            params: method === 'get' ? data : {}
        }).then(res => ({ res: res.data?.data ?? res.data, err: null }), err => ({ err, res: null }))
    }
}

export const GET = req('get')
export const POST = req('post')