
export interface SearchParameters {
    [key: string]: any;
}

type UseFetchOptions = {
    key?: string
    method?: string
    query?: SearchParameters
    params?: SearchParameters
    body?: RequestInit['body'] | Record<string, any>
    headers?: Record<string, string> | [key: string, value: string][] | Headers
    baseURL?: string
    server?: boolean
    lazy?: boolean
    immediate?: boolean
    pick?: string[]
}

export const useApiService = (request: string, opts?: UseFetchOptions): Promise<void> | void => {
    const config = useRuntimeConfig()
    const headers = authHeader()
    const apiFetch = $fetch.create({
        baseURL: config.public.baseURL,
        credentials: 'include',
        headers: {
            ...headers,
            'Accept': 'application/json'
        },
        // headers: { "Content-Type": "application/json" },

        onResponse({ request, response, options }) {
            // Process the response data
        },
        onResponseError({ request, response, options }) {
            if (response?.status == 401) {
                navigateTo("/client/login")
            }
            // Handle the response errors
        },
        onRequest({ request, options }) {
            // Set the request headers
        },
        onRequestError({ request, options, error }) {
            // Handle the request errors
        },
        ...opts
    })
    return apiFetch(request)

}

export const authHeader = (val = null) => {
    // const authStore = useAuthStore();
    // const token = useCookie('token').value
    // if (authStore.isLoggedIn) {
    //     return { Authorization: `Bearer ${token.access_token}` };
    // } else {}
}
export const get = (request: string, params?: SearchParameters, opts?: UseFetchOptions): Promise<void> | void => {
    return useApiService(request, { ...opts, method: "GET", params: params })
};

export const post = (request: string, params?: SearchParameters, opts?: UseFetchOptions): Promise<void> | void => {
    return useApiService(request, { ...opts, method: "POST", body: params })
};

export const put = (
    request: string,
    params: SearchParameters,
    opts?: UseFetchOptions
): Promise<void> | void => {
    if (params instanceof FormData) {
        params.append('_method', 'PUT');
    } else {
        params = { ...params, _method: 'PUT' };
    }

    return useApiService(request, { ...opts, method: 'POST', body: params });
};

export const remove = (request: string, params?: SearchParameters, opts?: UseFetchOptions): Promise<void> | void => {
    return useApiService(request, { ...opts, method: "DELETE" })
};


export default { get, post, put, remove, authHeader };

