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

export function getRefreshToken() {
	if (typeof window === 'undefined') {
		return null
	}

	return window.localStorage.getItem('refreshToken')
}

export function setAccessToken(token) {
	if (typeof window === 'undefined') {
		return
	}

	if (!token) {
		window.localStorage.removeItem('accessToken')
		return
	}

	window.localStorage.setItem('accessToken', token)
}

export function clearAuthTokens() {
	if (typeof window === 'undefined') {
		return
	}

	window.localStorage.removeItem('accessToken')
	window.localStorage.removeItem('refreshToken')
}

export function createApiError(message, response, data = null) {
	const error = new Error(message)
	error.status = response?.status
	error.data = data
	return error
}

let refreshTokenPromise = null

function buildRequestInit(options = {}) {
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

	return {
		auth,
		requestInit: {
			...rest,
			headers: requestHeaders,
			body: requestBody,
		},
	}
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
	const { auth, requestInit } = buildRequestInit(options)

	const executeRequest = () => fetch(buildUrl(path), requestInit)

	const handleResponse = async (response) => {
		const data = await parseResponse(response)

		if (!response.ok) {
			const message = data?.message || data?.error || data?.data?.message || 'Request failed'
			throw createApiError(message, response, data)
		}

		return { response, data }
	}

	const initialResponse = await executeRequest()

	if (initialResponse.status !== 401 || !auth || options.skipAuthRefresh) {
		return handleResponse(initialResponse)
	}

	const refreshToken = getRefreshToken()
	if (!refreshToken) {
		return handleResponse(initialResponse)
	}

	if (!refreshTokenPromise) {
		refreshTokenPromise = (async () => {
			const refreshedData = await apiJson('/api/auth/refresh-token', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${refreshToken}`,
				},
			})

			const nextAccessToken = refreshedData?.accessToken || refreshedData?.data?.accessToken
			if (!nextAccessToken) {
				throw new Error('Missing access token in refresh response')
			}

			setAccessToken(nextAccessToken)
			return nextAccessToken
		})().finally(() => {
			refreshTokenPromise = null
		})
	}

	try {
		const nextAccessToken = await refreshTokenPromise
		requestInit.headers.set('Authorization', `Bearer ${nextAccessToken}`)
		const retriedResponse = await executeRequest()

		if (retriedResponse.status === 401) {
			clearAuthTokens()
		}

		return handleResponse(retriedResponse)
	} catch (error) {
		clearAuthTokens()
		throw error
	}
}

function unwrapApiResponse(payload) {
	if (payload && typeof payload === 'object' && 'code' in payload && 'data' in payload) {
		return payload.data
	}

	return payload
}

export async function fetchWithAuth(path, options = {}) {
	return apiFetch(path, { ...options, auth: true })
}

export async function apiJson(path, options = {}) {
	const { data } = await apiFetch(path, options)
	return unwrapApiResponse(data)
}

export async function fetchWithAuthJson(path, options = {}) {
	const { data } = await fetchWithAuth(path, options)
	return unwrapApiResponse(data)
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
	requestLoginOtp: (payload) => apiJson('/api/auth/login/send-otp', { method: 'POST', body: payload }),
	verifyLoginOtp: (payload) => apiJson('/api/auth/login/verify-otp', { method: 'POST', body: payload }),
	requestRegisterOtp: (payload) => apiJson('/api/auth/register/send-otp', { method: 'POST', body: payload }),
	register: (payload) => apiJson('/api/auth/register', { method: 'POST', body: payload }),
	logout: () => apiJson('/api/auth/logout', { method: 'POST', auth: true }),
	refreshToken: () =>
		apiJson('/api/auth/refresh-token', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${getRefreshToken() || ''}`,
			},
		}),
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
		apiJson('/api/songs', { method: 'POST', auth: true, body: formData }),
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

export const userApi = {
	getUserProfile: (userId) => fetchWithAuthJson(`/api/users/${userId}`),
	updateProfile: (payload) => apiJson('/api/users/profile', { method: 'PUT', body: payload, auth: true }),
	uploadAvatar: (formData) => apiJson('/api/users/avatar', { method: 'POST', auth: true, body: formData }),
	getUserStats: () => fetchWithAuthJson('/api/users/stats'),
	getTopSongs: () => fetchWithAuthJson('/api/users/top-songs'),
	getTopArtists: () => fetchWithAuthJson('/api/users/top-artists'),
}

export const categoriesApi = {
	getCategories: () => fetchWithAuthJson('/api/categories'),
	getCategoryById: (id) => fetchWithAuthJson(`/api/categories/${id}`),
	getSongsByCategory: (categoryId, params = {}) =>
		fetchWithAuthJson(`/api/categories/${categoryId}/songs${toQueryString(params)}`),
}

export const recommendationsApi = {
	getRecommendedSongs: (params = {}) =>
		fetchWithAuthJson(`/api/recommendations/songs${toQueryString(params)}`),
	getRecommendedPlaylists: (params = {}) =>
		fetchWithAuthJson(`/api/recommendations/playlists${toQueryString(params)}`),
	getRecommendedArtists: (params = {}) =>
		fetchWithAuthJson(`/api/recommendations/artists${toQueryString(params)}`),
}

export const commentsApi = {
	getSongComments: (songId, params = {}) =>
		fetchWithAuthJson(`/api/songs/${songId}/comments${toQueryString(params)}`),
	addComment: (songId, payload) =>
		apiJson(`/api/songs/${songId}/comments`, { method: 'POST', body: payload, auth: true }),
	updateComment: (songId, commentId, payload) =>
		apiJson(`/api/songs/${songId}/comments/${commentId}`, { method: 'PUT', body: payload, auth: true }),
	deleteComment: (songId, commentId) =>
		apiJson(`/api/songs/${songId}/comments/${commentId}`, { method: 'DELETE', auth: true }),
	likeComment: (songId, commentId) =>
		apiJson(`/api/songs/${songId}/comments/${commentId}/like`, { method: 'POST', auth: true }),
	unlikeComment: (songId, commentId) =>
		apiJson(`/api/songs/${songId}/comments/${commentId}/unlike`, { method: 'DELETE', auth: true }),
}

export const sharingApi = {
	sharePlaylist: (playlistId) =>
		apiJson(`/api/playlists/${playlistId}/share`, { method: 'POST', auth: true }),
	shareSong: (songId) => apiJson(`/api/songs/${songId}/share`, { method: 'POST', auth: true }),
	shareArtist: (artistId) =>
		apiJson(`/api/artists/${artistId}/share`, { method: 'POST', auth: true }),
	getSharedContent: (shareCode) => fetchWithAuthJson(`/api/shared/${shareCode}`),
}

export const notificationsApi = {
	getNotifications: (params = {}) =>
		fetchWithAuthJson(`/api/notifications${toQueryString(params)}`),
	markAsRead: (notificationId) =>
		apiJson(`/api/notifications/${notificationId}/read`, { method: 'PUT', auth: true }),
	markAllAsRead: () => apiJson('/api/notifications/read-all', { method: 'PUT', auth: true }),
	deleteNotification: (notificationId) =>
		apiJson(`/api/notifications/${notificationId}`, { method: 'DELETE', auth: true }),
	deleteAllNotifications: () => apiJson('/api/notifications', { method: 'DELETE', auth: true }),
}

export const ratingsApi = {
	getSongRating: (songId) => fetchWithAuthJson(`/api/songs/${songId}/rating`),
	rateSong: (songId, rating) =>
		apiJson(`/api/songs/${songId}/rating`, { method: 'POST', body: { rating }, auth: true }),
	updateRating: (songId, rating) =>
		apiJson(`/api/songs/${songId}/rating`, { method: 'PUT', body: { rating }, auth: true }),
	deleteRating: (songId) => apiJson(`/api/songs/${songId}/rating`, { method: 'DELETE', auth: true }),
}

export const playlistDetailsApi = {
	getPlaylistSongs: (playlistId, params = {}) =>
		fetchWithAuthJson(`/api/playlists/${playlistId}/songs${toQueryString(params)}`),
	changePlaylistCover: (playlistId, formData) =>
		apiJson(`/api/playlists/${playlistId}/cover`, { method: 'POST', auth: true, body: formData }),
}

export const albumDetailsApi = {
	getAlbumSongs: (albumId, params = {}) =>
		fetchWithAuthJson(`/api/albums/${albumId}/songs${toQueryString(params)}`),
}
