import { useEffect, useMemo, useState } from 'react'
import { Music2 } from 'lucide-react'

import SidebarApp from '@/components/SidebarApp'
import MusicPlay from '@/components/MusicPlay'
import { apiJson } from '@/lib/api'

function UserDashboard() {

	const [songs, setSongs] = useState([])

	useEffect(() => {
		const fetchSongs = async () => {
			try {
				const data = await apiJson('/api/songs/trending', {
					headers: {
						Accept: 'application/json',
					},
				})
				setSongs(Array.isArray(data) ? data : data?.data?.content || data?.content || [])
			} catch (error) {
				console.error('Error loading trending songs', error)
			}
		}

		fetchSongs()
	}, [])

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="flex">
				<div className="hidden md:block">
					<SidebarApp />
				</div>

				<main className="flex-1 p-5 md:p-8 pb-44">
					<div className="mb-8">
						<h1 className="text-2xl md:text-3xl font-bold text-slate-900">User Dashboard</h1>
						<p className="text-slate-600 mt-2">Nghe nhac, quan ly playlist va dieu huong nhanh.</p>
					</div>

					<section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<div className="lg:col-span-2 rounded-xl border bg-white p-5 shadow-sm">
							<h2 className="text-lg font-semibold text-slate-900 mb-3">Danh sach bai hat</h2>
							<div className="space-y-2">
								{songs.map((song) => (
									<div
										key={song.id}
										className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
									>
										<Music2 className="w-4 h-4 text-red-700" />
										<div className="min-w-0">
											<p className="font-medium text-slate-900 truncate">{song.title}</p>
											<p className="text-sm text-slate-500 truncate">{song.artist}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="rounded-xl border bg-white p-5 shadow-sm">
							<h2 className="text-lg font-semibold text-slate-900 mb-3">Now Playing</h2>
							<div className="rounded-lg border border-red-200 bg-red-100 p-4">
								<p className="text-sm text-red-800">Bai hat hien tai</p>
								<p className="font-semibold text-red-950 mt-1">{currentSong?.title || 'Chua phat'}</p>
								<p className="text-sm text-red-800">{currentSong?.artist || 'Unknown artist'}</p>
							</div>
						</div>
					</section>
				</main>
			</div>

			<MusicPlay songs={songs} onSongChange={setCurrentSong} />
		</div>
	)
}

export default UserDashboard
