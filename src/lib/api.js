const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

function buildUrl(path) {
	if (!path) {
		throw new Error('API path is required')
	}

	if (/^https?:\/\//i.test(path)) {
		return path
	}

	if (!API_BASE_URL) {
		return path
	}

	const normalizedBase = API_BASE_URL.endsWith('/')
		? API_BASE_URL.slice(0, -1)
		: API_BASE_URL
	const normalizedPath = path.startsWith('/') ? path : `/${path}`

	return `${normalizedBase}${normalizedPath}`
}

export function getAccessToken() {
	if (typeof window === 'undefined') {
		return null
	}

	return window.localStorage.getItem('accessToken')
}

export function createApiError(message, response, data = null) {
	const error = new Error(message)
	error.status = response?.status
	error.data = data
	return error
}

async function parseResponse(response) {
	const contentType = response.headers.get('content-type') || ''

	if (contentType.includes('application/json')) {
		return response.json()
	}

	const text = await response.text()
	return text ? { message: text } : null
}

export async function apiFetch(path, options = {}) {
	const { auth = false, headers, body, ...rest } = options

	const requestHeaders = new Headers(headers || {})

	if (auth) {
		const token = getAccessToken()
		if (token) {
			requestHeaders.set('Authorization', `Bearer ${token}`)
		}
	}

	let requestBody = body
	const isBodyObject =
		body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)

	if (isBodyObject) {
		if (!requestHeaders.has('Content-Type')) {
			requestHeaders.set('Content-Type', 'application/json')
		}
		if (!requestHeaders.has('Accept')) {
			requestHeaders.set('Accept', 'application/json')
		}
		requestBody = JSON.stringify(body)
	}

	const response = await fetch(buildUrl(path), {
		...rest,
		headers: requestHeaders,
		body: requestBody,
	})

	const data = await parseResponse(response)

	if (!response.ok) {
		const message = data?.message || data?.error || 'Request failed'
		throw createApiError(message, response, data)
	}

	return { response, data }
}

export async function fetchWithAuth(path, options = {}) {
	return apiFetch(path, { ...options, auth: true })
}

export async function apiJson(path, options = {}) {
	const { data } = await apiFetch(path, options)
	return data
}

export async function fetchWithAuthJson(path, options = {}) {
	const { data } = await fetchWithAuth(path, options)
	return data
}
