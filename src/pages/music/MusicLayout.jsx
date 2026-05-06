import React from 'react'
import { Outlet } from 'react-router-dom'
import SidebarApp from '@/components/SidebarApp'
import { MusicProvider, useMusic } from '@/contexts/MusicContext'
import MusicPlay from '@/components/MusicPlay'
import AppHeader from '@/components/AppHeader'

function InnerLayout() {
  const { songs, currentSong, setCurrentSong } = useMusic()

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <div className="flex gap-4 px-4 pt-4">
        <div className="hidden md:block">
          <SidebarApp />
        </div>

        <main className="flex-1 p-5 md:p-8 pb-44">
          <Outlet />
        </main>
      </div>

      <MusicPlay songs={songs} currentSong={currentSong} onSongChange={setCurrentSong} />
    </div>
  )
}

export default function MusicLayout() {
  return (
    <MusicProvider>
      <InnerLayout />
    </MusicProvider>
  )
}
