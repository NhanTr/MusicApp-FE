import { useEffect, useRef } from 'react'

const MIN_SECONDS = 30
const REPEAT_WINDOW = 10 * 60 * 1000

export function useListenTracker(
	audioRef,
	currentSong
) {
	const counted = useRef(false)

	useEffect(() => {
		counted.current = false
	}, [currentSong])

	useEffect(() => {
		const audio = audioRef.current

		if (!audio || !currentSong)
			return

		const handleProgress = () => {
			if (counted.current)
				return

			const current =
				audio.currentTime

			const duration =
				audio.duration || 0

			const listenedEnough =
				current >= MIN_SECONDS ||
				(duration &&
					current / duration >=
						0.5)

			if (!listenedEnough)
				return

			const key =
				`listen-${currentSong.id}`

			const last =
				localStorage.getItem(
					key
				)

			if (
				last &&
				Date.now() -
					Number(last) <
					REPEAT_WINDOW
			) {
				counted.current = true
				return
			}

			localStorage.setItem(
				key,
				Date.now()
			)

			const total =
				Number(
					localStorage.getItem(
						'listen-count'
					)
				) || 0

			localStorage.setItem(
				'listen-count',
				total + 1
			)

			counted.current = true
		}

		audio.addEventListener(
			'timeupdate',
			handleProgress
		)

		return () => {
			audio.removeEventListener(
				'timeupdate',
				handleProgress
			)
		}
	}, [audioRef, currentSong])
}