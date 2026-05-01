import React from 'react'
import { Outlet } from 'react-router-dom'
import SidebarApp from '@/components/SidebarApp'
import { MusicProvider, useMusic } from '@/contexts/MusicContext'
import MusicPlay from '@/components/MusicPlay'

function InnerLayout() {
  const { songs, setCurrentSong } = useMusic()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <div className="hidden md:block">
          <SidebarApp />
        </div>

        <main className="flex-1 p-5 md:p-8 pb-44">
          <Outlet />
        </main>
      </div>

      <MusicPlay songs={songs} onSongChange={setCurrentSong} />
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
