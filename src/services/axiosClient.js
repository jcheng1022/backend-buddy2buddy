import axios from 'axios'

class APIClient {

    constructor() {
        this.api = axios.create({
            headers: {
                'Content-Type': 'application/json'
            },
            baseURL:  process.env.NEXT_PUBLIC_API_BASE_URL
        })

        this.baseApi = axios.create({
            headers: {
                'Content-Type': 'application/json'
            },
            baseURL: process.env.API_BASE_URL
        })

        this.setInterceptors()
    }

    setInterceptors() {
        this.api.interceptors.request.eject(this.requestInterceptor)
        this.api.interceptors.response.eject(this.responseInterceptor)

        this.requestInterceptor = this.api.interceptors.request.use(async (config) => {
            // const { data } = await supabase.auth.getSession()
            //
            // if (data.session?.access_token) {
            //     config.headers['Authorization'] = `Bearer ${data.session?.access_token}`
            // }
            return config
        }, (error) => {
            return Promise.reject(error)
        })



        this.responseInterceptor = this.api.interceptors.response.use(
            (response) => {
                return Promise.resolve(response.data?.data ?? response.data);
            },
            (error) => {
                return Promise.reject(error.response?.data?.data || error.response?.data || error.toString());
            }
        );
    }
}

export default new APIClient


