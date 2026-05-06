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

function toQueryString(params = {}) {
	const searchParams = new URLSearchParams()

	Object.entries(params).forEach(([key, value]) => {
		if (value === undefined || value === null || value === '') {
			return
		}

		searchParams.set(key, String(value))
	})

	const query = searchParams.toString()
	return query ? `?${query}` : ''
}

function extractList(data) {
	if (Array.isArray(data)) {
		return data
	}

	return (
		data?.data?.content ||
		data?.content ||
		data?.items ||
		data?.results ||
		[]
	)
}

export const apiUtils = {
	toQueryString,
	extractList,
}

export const authApi = {
	login: (payload) => apiJson('/api/auth/login', { method: 'POST', body: payload }),
	register: (payload) => apiJson('/api/auth/register', { method: 'POST', body: payload }),
	logout: () => apiJson('/api/auth/logout', { method: 'POST', auth: true }),
	refreshToken: (payload) =>
		apiJson('/api/auth/refresh-token', { method: 'POST', body: payload, auth: true }),
	updatePassword: (payload) =>
		apiJson('/api/auth/update-password', { method: 'PUT', body: payload, auth: true }),
	me: () => fetchWithAuthJson('/api/auth/me'),
}

export const songsApi = {
	getSongs: (params = {}) => fetchWithAuthJson(`/api/songs${toQueryString(params)}`),
	getSongById: (id) => fetchWithAuthJson(`/api/songs/${id}`),
	getTrendingSongs: () => fetchWithAuthJson('/api/songs/trending'),
	searchSongs: (query) => fetchWithAuthJson(`/api/songs/search${toQueryString({ q: query })}`),
	createSong: (payload) => apiJson('/api/songs', { method: 'POST', body: payload, auth: true }),
	updateSong: (id, payload) =>
		apiJson(`/api/songs/${id}`, { method: 'PUT', body: payload, auth: true }),
	deleteSong: (id) => apiJson(`/api/songs/${id}`, { method: 'DELETE', auth: true }),
	uploadSong: (formData) =>
		apiFetch('/api/uploads', { method: 'POST', auth: true, body: formData }),
}

export const playlistsApi = {
	getPlaylists: () => fetchWithAuthJson('/api/playlists'),
	getPublicPlaylists: () => fetchWithAuthJson('/api/playlists/public'),
	getPlaylistById: (id) => fetchWithAuthJson(`/api/playlists/${id}`),
	createPlaylist: (payload) =>
		apiJson('/api/playlists', { method: 'POST', body: payload, auth: true }),
	updatePlaylist: (id, payload) =>
		apiJson(`/api/playlists/${id}`, { method: 'PUT', body: payload, auth: true }),
	deletePlaylist: (id) => apiJson(`/api/playlists/${id}`, { method: 'DELETE', auth: true }),
	addSongIntoPlaylist: (id, payload) =>
		apiJson(`/api/playlists/${id}/songs`, { method: 'POST', body: payload, auth: true }),
	removeSongFromPlaylist: (id, songId) =>
		apiJson(`/api/playlists/${id}/songs/${songId}`, { method: 'DELETE', auth: true }),
}

export const albumsApi = {
	getAlbums: (params = {}) => fetchWithAuthJson(`/api/albums${toQueryString(params)}`),
	getAlbumById: (id) => fetchWithAuthJson(`/api/albums/${id}`),
	createAlbum: (payload) => apiJson('/api/albums', { method: 'POST', body: payload, auth: true }),
	updateAlbum: (id, payload) =>
		apiJson(`/api/albums/${id}`, { method: 'PUT', body: payload, auth: true }),
	deleteAlbum: (id) => apiJson(`/api/albums/${id}`, { method: 'DELETE', auth: true }),
}

export const artistsApi = {
	getArtists: () => fetchWithAuthJson('/api/artists'),
	getArtistById: (id) => fetchWithAuthJson(`/api/artists/${id}`),
	getArtistSongs: (id) => fetchWithAuthJson(`/api/artists/${id}/songs`),
	getArtistAlbums: (id) => fetchWithAuthJson(`/api/artists/${id}/albums`),
	getArtistFollowers: (id) => fetchWithAuthJson(`/api/artists/${id}/followers`),
	createArtist: (payload) => apiJson('/api/artists', { method: 'POST', body: payload, auth: true }),
	updateArtist: (id, payload) =>
		apiJson(`/api/artists/${id}`, { method: 'PUT', body: payload, auth: true }),
	deleteArtist: (id) => apiJson(`/api/artists/${id}`, { method: 'DELETE', auth: true }),
}

export const followApi = {
	getFollowedArtists: () => fetchWithAuthJson('/api/follow/artists'),
	checkFollowStatus: (id) => fetchWithAuthJson(`/api/follow/artists/${id}/status`),
	followArtist: (id) => apiJson(`/api/follow/artists/${id}`, { method: 'POST', auth: true }),
	unfollowArtist: (id) => apiJson(`/api/follow/artists/${id}`, { method: 'DELETE', auth: true }),
}

export const favoritesApi = {
	getFavorites: (params = {}) => fetchWithAuthJson(`/api/favorites${toQueryString(params)}`),
	likeSong: (songId) => apiJson(`/api/favorites/${songId}`, { method: 'POST', auth: true }),
	unlikeSong: (songId) => apiJson(`/api/favorites/${songId}`, { method: 'DELETE', auth: true }),
}

export const historyApi = {
	getHistory: () => fetchWithAuthJson('/api/history'),
	addHistory: (payload) => apiJson('/api/history', { method: 'POST', body: payload, auth: true }),
	deleteHistoryById: (id) => apiJson(`/api/history/${id}`, { method: 'DELETE', auth: true }),
	deleteAllHistory: () => apiJson('/api/history', { method: 'DELETE', auth: true }),
}

export const searchApi = {
	search: (query) => fetchWithAuthJson(`/api/search${toQueryString({ q: query })}`),
}

export const adminApi = {
	getStatus: () => fetchWithAuthJson('/api/admin/stats'),
	getUsers: (params = {}) => fetchWithAuthJson(`/api/admin/users${toQueryString(params)}`),
	getUserById: (id) => fetchWithAuthJson(`/api/admin/users/${id}`),
	banUser: (id) => apiJson(`/api/admin/users/${id}/ban`, { method: 'PUT', auth: true }),
	unbanUser: (id) => apiJson(`/api/admin/users/${id}/unban`, { method: 'PUT', auth: true }),
	deleteAdminSong: (id) => apiJson(`/api/admin/songs/${id}`, { method: 'DELETE', auth: true }),
}
