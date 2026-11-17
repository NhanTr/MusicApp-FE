# Source inventory

[Documentation index](README.md)

Linked inventory of maintained application source and key configuration as inspected on 2026-11-17. Paths are relative to the workspace. Generated build output, node_modules, private environment files, Git metadata, media assets, and database dump contents are excluded. Existing local modifications are part of this baseline.

## Frontend application files

### Entry points, routing, state, utilities and hooks

| File | Role |
| --- | --- |
| [src/.DS_Store](../src/.DS_Store) | .DS_Store implementation; route/state ownership described in frontend guide |
| [src/App.css](../src/App.css) | Stylesheet; inspect entry imports before editing global styles |
| [src/App.jsx](../src/App.jsx) | App implementation; route/state ownership described in frontend guide |
| [src/contexts/MusicContext.jsx](../src/contexts/MusicContext.jsx) | MusicContext implementation; route/state ownership described in frontend guide |
| [src/globals.css](../src/globals.css) | Stylesheet; inspect entry imports before editing global styles |
| [src/hooks/useCatalogData.js](../src/hooks/useCatalogData.js) | Shared hook for CatalogData |
| [src/hooks/useDialogFocus.js](../src/hooks/useDialogFocus.js) | Shared hook for DialogFocus |
| [src/hooks/useLikedSongs.js](../src/hooks/useLikedSongs.js) | Shared hook for LikedSongs |
| [src/hooks/useListenTracker.js](../src/hooks/useListenTracker.js) | Shared hook for ListenTracker |
| [src/index.css](../src/index.css) | Stylesheet; inspect entry imports before editing global styles |
| [src/lib/api.js](../src/lib/api.js) | Shared HTTP, tokens, resource API helpers |
| [src/lib/format.js](../src/lib/format.js) | format implementation; route/state ownership described in frontend guide |
| [src/lib/queue.js](../src/lib/queue.js) | queue implementation; route/state ownership described in frontend guide |
| [src/lib/song-utils.js](../src/lib/song-utils.js) | Shared song wrapper/field normalization |
| [src/lib/utils.ts](../src/lib/utils.ts) | Shared CSS class utility |
| [src/main.jsx](../src/main.jsx) | main implementation; route/state ownership described in frontend guide |
| [src/routes/AppRoutes.jsx](../src/routes/AppRoutes.jsx) | AppRoutes implementation; route/state ownership described in frontend guide |
| [src/styles/music.css](../src/styles/music.css) | Stylesheet; inspect entry imports before editing global styles |

### Features

| File | Role |
| --- | --- |
| [src/features/.DS_Store](../src/features/.DS_Store) | .DS_Store implementation; route/state ownership described in frontend guide |
| [src/features/albums/AlbumDetailPage.jsx](../src/features/albums/AlbumDetailPage.jsx) | AlbumDetailPage implementation; route/state ownership described in frontend guide |
| [src/features/albums/AlbumsPage.jsx](../src/features/albums/AlbumsPage.jsx) | AlbumsPage implementation; route/state ownership described in frontend guide |
| [src/features/artists/ArtistDetailPage.jsx](../src/features/artists/ArtistDetailPage.jsx) | ArtistDetailPage implementation; route/state ownership described in frontend guide |
| [src/features/artists/ArtistsPage.jsx](../src/features/artists/ArtistsPage.jsx) | ArtistsPage implementation; route/state ownership described in frontend guide |
| [src/features/auth/LoginPage.jsx](../src/features/auth/LoginPage.jsx) | LoginPage implementation; route/state ownership described in frontend guide |
| [src/features/auth/SignUpPage.jsx](../src/features/auth/SignUpPage.jsx) | SignUpPage implementation; route/state ownership described in frontend guide |
| [src/features/catalog/CatalogGallery.jsx](../src/features/catalog/CatalogGallery.jsx) | CatalogGallery implementation; route/state ownership described in frontend guide |
| [src/features/catalog/usePagedSearch.js](../src/features/catalog/usePagedSearch.js) | Shared hook for PagedSearch |
| [src/features/favorites/Favorites.jsx](../src/features/favorites/Favorites.jsx) | Favorites implementation; route/state ownership described in frontend guide |
| [src/features/history/History.jsx](../src/features/history/History.jsx) | History implementation; route/state ownership described in frontend guide |
| [src/features/playlists/Playlists.jsx](../src/features/playlists/Playlists.jsx) | Playlists implementation; route/state ownership described in frontend guide |
| [src/features/profile/Profile.jsx](../src/features/profile/Profile.jsx) | Profile implementation; route/state ownership described in frontend guide |
| [src/features/search/SearchPage.jsx](../src/features/search/SearchPage.jsx) | SearchPage implementation; route/state ownership described in frontend guide |
| [src/features/songs/SongCatalog.jsx](../src/features/songs/SongCatalog.jsx) | SongCatalog implementation; route/state ownership described in frontend guide |
| [src/features/songs/SongsPage.jsx](../src/features/songs/SongsPage.jsx) | SongsPage implementation; route/state ownership described in frontend guide |
| [src/features/songs/Trending.jsx](../src/features/songs/Trending.jsx) | Trending implementation; route/state ownership described in frontend guide |
| [src/features/upload/Upload.jsx](../src/features/upload/Upload.jsx) | Upload implementation; route/state ownership described in frontend guide |

### Pages and layouts

| File | Role |
| --- | --- |
| [src/pages/LandingPage.jsx](../src/pages/LandingPage.jsx) | LandingPage implementation; route/state ownership described in frontend guide |
| [src/pages/UserDashboard.jsx](../src/pages/UserDashboard.jsx) | UserDashboard implementation; route/state ownership described in frontend guide |
| [src/pages/admin/AdminAccounts.jsx](../src/pages/admin/AdminAccounts.jsx) | AdminAccounts implementation; route/state ownership described in frontend guide |
| [src/pages/admin/AdminAdmins.jsx](../src/pages/admin/AdminAdmins.jsx) | Unrouted admin page; see active AppRoutes before editing |
| [src/pages/admin/AdminAlbums.jsx](../src/pages/admin/AdminAlbums.jsx) | AdminAlbums implementation; route/state ownership described in frontend guide |
| [src/pages/admin/AdminArtists.jsx](../src/pages/admin/AdminArtists.jsx) | AdminArtists implementation; route/state ownership described in frontend guide |
| [src/pages/admin/AdminLayout.jsx](../src/pages/admin/AdminLayout.jsx) | AdminLayout implementation; route/state ownership described in frontend guide |
| [src/pages/admin/AdminSongs.jsx](../src/pages/admin/AdminSongs.jsx) | AdminSongs implementation; route/state ownership described in frontend guide |
| [src/pages/admin/ArtistsAdmin.jsx](../src/pages/admin/ArtistsAdmin.jsx) | Unrouted admin page; see active AppRoutes before editing |
| [src/pages/admin/PlaylistsAdmin.jsx](../src/pages/admin/PlaylistsAdmin.jsx) | Unrouted admin page; see active AppRoutes before editing |
| [src/pages/admin/SongsAdmin.jsx](../src/pages/admin/SongsAdmin.jsx) | Unrouted admin page; see active AppRoutes before editing |
| [src/pages/admin/UploadsAdmin.jsx](../src/pages/admin/UploadsAdmin.jsx) | Unrouted admin page; see active AppRoutes before editing |
| [src/pages/admin/UsersAdmin.jsx](../src/pages/admin/UsersAdmin.jsx) | Unrouted admin page; see active AppRoutes before editing |
| [src/pages/music/MusicLayout.jsx](../src/pages/music/MusicLayout.jsx) | MusicLayout implementation; route/state ownership described in frontend guide |

### Shared application components

| File | Role |
| --- | --- |
| [src/components/AdminRoute.jsx](../src/components/AdminRoute.jsx) | AdminRoute implementation; route/state ownership described in frontend guide |
| [src/components/AppHeader.jsx](../src/components/AppHeader.jsx) | AppHeader implementation; route/state ownership described in frontend guide |
| [src/components/LikeButton.jsx](../src/components/LikeButton.jsx) | LikeButton implementation; route/state ownership described in frontend guide |
| [src/components/MusicPlay.jsx](../src/components/MusicPlay.jsx) | MusicPlay implementation; route/state ownership described in frontend guide |
| [src/components/ProtectedRoute.jsx](../src/components/ProtectedRoute.jsx) | ProtectedRoute implementation; route/state ownership described in frontend guide |
| [src/components/SidebarApp.jsx](../src/components/SidebarApp.jsx) | SidebarApp implementation; route/state ownership described in frontend guide |

### UI primitives

| File | Role |
| --- | --- |
| [src/components/ui/accordion.tsx](../src/components/ui/accordion.tsx) | Reusable accordion UI primitive/helper; not a standalone feature route |
| [src/components/ui/alert-dialog.tsx](../src/components/ui/alert-dialog.tsx) | Reusable alert-dialog UI primitive/helper; not a standalone feature route |
| [src/components/ui/alert.tsx](../src/components/ui/alert.tsx) | Reusable alert UI primitive/helper; not a standalone feature route |
| [src/components/ui/aspect-ratio.tsx](../src/components/ui/aspect-ratio.tsx) | Reusable aspect-ratio UI primitive/helper; not a standalone feature route |
| [src/components/ui/avatar.tsx](../src/components/ui/avatar.tsx) | Reusable avatar UI primitive/helper; not a standalone feature route |
| [src/components/ui/badge.tsx](../src/components/ui/badge.tsx) | Reusable badge UI primitive/helper; not a standalone feature route |
| [src/components/ui/breadcrumb.tsx](../src/components/ui/breadcrumb.tsx) | Reusable breadcrumb UI primitive/helper; not a standalone feature route |
| [src/components/ui/button-group.tsx](../src/components/ui/button-group.tsx) | Reusable button-group UI primitive/helper; not a standalone feature route |
| [src/components/ui/button.tsx](../src/components/ui/button.tsx) | Reusable button UI primitive/helper; not a standalone feature route |
| [src/components/ui/calendar.tsx](../src/components/ui/calendar.tsx) | Reusable calendar UI primitive/helper; not a standalone feature route |
| [src/components/ui/card.tsx](../src/components/ui/card.tsx) | Reusable card UI primitive/helper; not a standalone feature route |
| [src/components/ui/carousel.tsx](../src/components/ui/carousel.tsx) | Reusable carousel UI primitive/helper; not a standalone feature route |
| [src/components/ui/chart.tsx](../src/components/ui/chart.tsx) | Reusable chart UI primitive/helper; not a standalone feature route |
| [src/components/ui/checkbox.tsx](../src/components/ui/checkbox.tsx) | Reusable checkbox UI primitive/helper; not a standalone feature route |
| [src/components/ui/collapsible.tsx](../src/components/ui/collapsible.tsx) | Reusable collapsible UI primitive/helper; not a standalone feature route |
| [src/components/ui/command.tsx](../src/components/ui/command.tsx) | Reusable command UI primitive/helper; not a standalone feature route |
| [src/components/ui/context-menu.tsx](../src/components/ui/context-menu.tsx) | Reusable context-menu UI primitive/helper; not a standalone feature route |
| [src/components/ui/dialog.tsx](../src/components/ui/dialog.tsx) | Reusable dialog UI primitive/helper; not a standalone feature route |
| [src/components/ui/drawer.tsx](../src/components/ui/drawer.tsx) | Reusable drawer UI primitive/helper; not a standalone feature route |
| [src/components/ui/dropdown-menu.tsx](../src/components/ui/dropdown-menu.tsx) | Reusable dropdown-menu UI primitive/helper; not a standalone feature route |
| [src/components/ui/empty.tsx](../src/components/ui/empty.tsx) | Reusable empty UI primitive/helper; not a standalone feature route |
| [src/components/ui/field.tsx](../src/components/ui/field.tsx) | Reusable field UI primitive/helper; not a standalone feature route |
| [src/components/ui/form.tsx](../src/components/ui/form.tsx) | Reusable form UI primitive/helper; not a standalone feature route |
| [src/components/ui/hover-card.tsx](../src/components/ui/hover-card.tsx) | Reusable hover-card UI primitive/helper; not a standalone feature route |
| [src/components/ui/input-group.tsx](../src/components/ui/input-group.tsx) | Reusable input-group UI primitive/helper; not a standalone feature route |
| [src/components/ui/input-otp.tsx](../src/components/ui/input-otp.tsx) | Reusable input-otp UI primitive/helper; not a standalone feature route |
| [src/components/ui/input.tsx](../src/components/ui/input.tsx) | Reusable input UI primitive/helper; not a standalone feature route |
| [src/components/ui/item.tsx](../src/components/ui/item.tsx) | Reusable item UI primitive/helper; not a standalone feature route |
| [src/components/ui/kbd.tsx](../src/components/ui/kbd.tsx) | Reusable kbd UI primitive/helper; not a standalone feature route |
| [src/components/ui/label.tsx](../src/components/ui/label.tsx) | Reusable label UI primitive/helper; not a standalone feature route |
| [src/components/ui/menubar.tsx](../src/components/ui/menubar.tsx) | Reusable menubar UI primitive/helper; not a standalone feature route |
| [src/components/ui/navigation-menu.tsx](../src/components/ui/navigation-menu.tsx) | Reusable navigation-menu UI primitive/helper; not a standalone feature route |
| [src/components/ui/pagination.tsx](../src/components/ui/pagination.tsx) | Reusable pagination UI primitive/helper; not a standalone feature route |
| [src/components/ui/popover.tsx](../src/components/ui/popover.tsx) | Reusable popover UI primitive/helper; not a standalone feature route |
| [src/components/ui/progress.tsx](../src/components/ui/progress.tsx) | Reusable progress UI primitive/helper; not a standalone feature route |
| [src/components/ui/radio-group.tsx](../src/components/ui/radio-group.tsx) | Reusable radio-group UI primitive/helper; not a standalone feature route |
| [src/components/ui/resizable.tsx](../src/components/ui/resizable.tsx) | Reusable resizable UI primitive/helper; not a standalone feature route |
| [src/components/ui/scroll-area.tsx](../src/components/ui/scroll-area.tsx) | Reusable scroll-area UI primitive/helper; not a standalone feature route |
| [src/components/ui/select.tsx](../src/components/ui/select.tsx) | Reusable select UI primitive/helper; not a standalone feature route |
| [src/components/ui/separator.tsx](../src/components/ui/separator.tsx) | Reusable separator UI primitive/helper; not a standalone feature route |
| [src/components/ui/sheet.tsx](../src/components/ui/sheet.tsx) | Reusable sheet UI primitive/helper; not a standalone feature route |
| [src/components/ui/sidebar.tsx](../src/components/ui/sidebar.tsx) | Reusable sidebar UI primitive/helper; not a standalone feature route |
| [src/components/ui/skeleton.tsx](../src/components/ui/skeleton.tsx) | Reusable skeleton UI primitive/helper; not a standalone feature route |
| [src/components/ui/slider.tsx](../src/components/ui/slider.tsx) | Reusable slider UI primitive/helper; not a standalone feature route |
| [src/components/ui/sonner.tsx](../src/components/ui/sonner.tsx) | Reusable sonner UI primitive/helper; not a standalone feature route |
| [src/components/ui/spinner.tsx](../src/components/ui/spinner.tsx) | Reusable spinner UI primitive/helper; not a standalone feature route |
| [src/components/ui/switch.tsx](../src/components/ui/switch.tsx) | Reusable switch UI primitive/helper; not a standalone feature route |
| [src/components/ui/table.tsx](../src/components/ui/table.tsx) | Reusable table UI primitive/helper; not a standalone feature route |
| [src/components/ui/tabs.tsx](../src/components/ui/tabs.tsx) | Reusable tabs UI primitive/helper; not a standalone feature route |
| [src/components/ui/textarea.tsx](../src/components/ui/textarea.tsx) | Reusable textarea UI primitive/helper; not a standalone feature route |
| [src/components/ui/toast.tsx](../src/components/ui/toast.tsx) | Reusable toast UI primitive/helper; not a standalone feature route |
| [src/components/ui/toaster.tsx](../src/components/ui/toaster.tsx) | Reusable toaster UI primitive/helper; not a standalone feature route |
| [src/components/ui/toggle-group.tsx](../src/components/ui/toggle-group.tsx) | Reusable toggle-group UI primitive/helper; not a standalone feature route |
| [src/components/ui/toggle.tsx](../src/components/ui/toggle.tsx) | Reusable toggle UI primitive/helper; not a standalone feature route |
| [src/components/ui/tooltip.tsx](../src/components/ui/tooltip.tsx) | Reusable tooltip UI primitive/helper; not a standalone feature route |
| [src/components/ui/use-mobile.tsx](../src/components/ui/use-mobile.tsx) | Reusable use-mobile UI primitive/helper; not a standalone feature route |
| [src/components/ui/use-toast.ts](../src/components/ui/use-toast.ts) | Reusable use-toast UI primitive/helper; not a standalone feature route |

## Backend application files

### controller

| File | Role |
| --- | --- |
| [AdminController.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/AdminController.java) | HTTP routes and parameter binding |
| [AlbumController.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/AlbumController.java) | HTTP routes and parameter binding |
| [ArtistController.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/ArtistController.java) | HTTP routes and parameter binding |
| [AuthController.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/AuthController.java) | HTTP routes and parameter binding |
| [FavoriteController.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/FavoriteController.java) | HTTP routes and parameter binding |
| [FollowController.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/FollowController.java) | HTTP routes and parameter binding |
| [HistoryController.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/HistoryController.java) | HTTP routes and parameter binding |
| [PlaylistController.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/PlaylistController.java) | HTTP routes and parameter binding |
| [SearchController.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/SearchController.java) | HTTP routes and parameter binding |
| [SongControlller.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/SongControlller.java) | HTTP routes and parameter binding |
| [UploadController.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/UploadController.java) | HTTP routes and parameter binding |
| [UserController.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/UserController.java) | HTTP routes and parameter binding |

### service

| File | Role |
| --- | --- |
| [AdminService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/AdminService.java) | Business operations or service interface |
| [AdminServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/AdminServiceImpl.java) | Business operations or service interface |
| [AlbumService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/AlbumService.java) | Business operations or service interface |
| [AlbumServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/AlbumServiceImpl.java) | Business operations or service interface |
| [ArtistService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/ArtistService.java) | Business operations or service interface |
| [ArtistServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/ArtistServiceImpl.java) | Business operations or service interface |
| [AuthService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/AuthService.java) | Business operations or service interface |
| [AuthServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/AuthServiceImpl.java) | Business operations or service interface |
| [CurrentUserService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/CurrentUserService.java) | Business operations or service interface |
| [CurrentUserServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/CurrentUserServiceImpl.java) | Business operations or service interface |
| [EmailService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/EmailService.java) | Business operations or service interface |
| [FavoriteService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/FavoriteService.java) | Business operations or service interface |
| [FavoriteServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/FavoriteServiceImpl.java) | Business operations or service interface |
| [FollowService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/FollowService.java) | Business operations or service interface |
| [FollowServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/FollowServiceImpl.java) | Business operations or service interface |
| [HistoryService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/HistoryService.java) | Business operations or service interface |
| [HistoryServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/HistoryServiceImpl.java) | Business operations or service interface |
| [PlaylistService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/PlaylistService.java) | Business operations or service interface |
| [PlaylistServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/PlaylistServiceImpl.java) | Business operations or service interface |
| [RedisService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/RedisService.java) | Business operations or service interface |
| [RedisServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/RedisServiceImpl.java) | Business operations or service interface |
| [SearchService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/SearchService.java) | Business operations or service interface |
| [SearchServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/SearchServiceImpl.java) | Business operations or service interface |
| [SongService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/SongService.java) | Business operations or service interface |
| [SongServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/SongServiceImpl.java) | Business operations or service interface |
| [UploadService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/UploadService.java) | Business operations or service interface |
| [UploadServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/UploadServiceImpl.java) | Business operations or service interface |
| [UserService.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/UserService.java) | Business operations or service interface |
| [UserServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/UserServiceImpl.java) | Business operations or service interface |

### repository

| File | Role |
| --- | --- |
| [AlbumRepository.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/repository/AlbumRepository.java) | Persistence interface and queries |
| [ArtistRepository.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/repository/ArtistRepository.java) | Persistence interface and queries |
| [FavoriteRepository.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/repository/FavoriteRepository.java) | Persistence interface and queries |
| [FollowArtistRepository.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/repository/FollowArtistRepository.java) | Persistence interface and queries |
| [ListeningHistoryRepository.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/repository/ListeningHistoryRepository.java) | Persistence interface and queries |
| [PlaylistRepository.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/repository/PlaylistRepository.java) | Persistence interface and queries |
| [PlaylistSongRepository.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/repository/PlaylistSongRepository.java) | Persistence interface and queries |
| [SongRepository.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/repository/SongRepository.java) | Persistence interface and queries |
| [UploadRepository.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/repository/UploadRepository.java) | Persistence interface and queries |
| [UserRepository.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/repository/UserRepository.java) | Persistence interface and queries |

### entity

| File | Role |
| --- | --- |
| [Album.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/entity/Album.java) | JPA table or composite key mapping |
| [Artist.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/entity/Artist.java) | JPA table or composite key mapping |
| [Favorite.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/entity/Favorite.java) | JPA table or composite key mapping |
| [FavoriteId.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/entity/FavoriteId.java) | JPA table or composite key mapping |
| [FollowArtist.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/entity/FollowArtist.java) | JPA table or composite key mapping |
| [FollowArtistId.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/entity/FollowArtistId.java) | JPA table or composite key mapping |
| [ListeningHistory.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/entity/ListeningHistory.java) | JPA table or composite key mapping |
| [Playlist.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/entity/Playlist.java) | JPA table or composite key mapping |
| [PlaylistSong.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/entity/PlaylistSong.java) | JPA table or composite key mapping |
| [PlaylistSongId.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/entity/PlaylistSongId.java) | JPA table or composite key mapping |
| [Song.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/entity/Song.java) | JPA table or composite key mapping |
| [Upload.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/entity/Upload.java) | JPA table or composite key mapping |
| [User.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/entity/User.java) | JPA table or composite key mapping |

### dto/request

| File | Role |
| --- | --- |
| [AlbumRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/AlbumRequest.java) | Request fields and validation |
| [ArtistRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/ArtistRequest.java) | Request fields and validation |
| [BanUserRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/BanUserRequest.java) | Request fields and validation |
| [CreatePlaylistRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/CreatePlaylistRequest.java) | Request fields and validation |
| [HistoryRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/HistoryRequest.java) | Request fields and validation |
| [LoginRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/LoginRequest.java) | Request fields and validation |
| [LogoutRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/LogoutRequest.java) | Request fields and validation |
| [PlaylistSongRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/PlaylistSongRequest.java) | Request fields and validation |
| [RegisterRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/RegisterRequest.java) | Request fields and validation |
| [RejectUploadRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/RejectUploadRequest.java) | Request fields and validation |
| [SendOtpRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/SendOtpRequest.java) | Request fields and validation |
| [SongRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/SongRequest.java) | Request fields and validation |
| [UpdatePasswordRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/UpdatePasswordRequest.java) | Request fields and validation |
| [UpdatePlaylistRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/UpdatePlaylistRequest.java) | Request fields and validation |
| [UploadRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/UploadRequest.java) | Request fields and validation |
| [UserUpdateRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/UserUpdateRequest.java) | Request fields and validation |
| [VerifyLoginOtpRequest.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/VerifyLoginOtpRequest.java) | Request fields and validation |

### dto/response

| File | Role |
| --- | --- |
| [APIResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/APIResponse.java) | Response fields |
| [AlbumResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/AlbumResponse.java) | Response fields |
| [AlbumSummaryResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/AlbumSummaryResponse.java) | Response fields |
| [ArtistResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/ArtistResponse.java) | Response fields |
| [ArtistSummaryResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/ArtistSummaryResponse.java) | Response fields |
| [FavoriteResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/FavoriteResponse.java) | Response fields |
| [HistoryResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/HistoryResponse.java) | Response fields |
| [LoginResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/LoginResponse.java) | Response fields |
| [PageResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/PageResponse.java) | Response fields |
| [PlaylistResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/PlaylistResponse.java) | Response fields |
| [RefreshTokenRespose.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/RefreshTokenRespose.java) | Response fields |
| [SearchResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/SearchResponse.java) | Response fields |
| [SongResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/SongResponse.java) | Response fields |
| [StatsResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/StatsResponse.java) | Response fields |
| [UploadResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/UploadResponse.java) | Response fields |
| [UserAdminResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/UserAdminResponse.java) | Response fields |
| [UserResponse.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/UserResponse.java) | Response fields |

### mapper

| File | Role |
| --- | --- |
| [MusicMapper.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/mapper/MusicMapper.java) | Entity/DTO mapping |
| [UserMapper.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/mapper/UserMapper.java) | Entity/DTO mapping |

### configuration

| File | Role |
| --- | --- |
| [CorsConfig.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/configuration/CorsConfig.java) | Application wiring or security/startup configuration |
| [JwtAuthenticationFilter.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/configuration/JwtAuthenticationFilter.java) | Application wiring or security/startup configuration |
| [RedisConfig.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/configuration/RedisConfig.java) | Application wiring or security/startup configuration |
| [S3Config.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/configuration/S3Config.java) | Application wiring or security/startup configuration |
| [SecurityConfig.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/configuration/SecurityConfig.java) | Application wiring or security/startup configuration |
| [UserStatusInitializer.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/configuration/UserStatusInitializer.java) | Application wiring or security/startup configuration |

### initialization

| File | Role |
| --- | --- |
| [AdminInitializer.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/initialization/AdminInitializer.java) | Startup bootstrap |

### exception

| File | Role |
| --- | --- |
| [AppException.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/exception/AppException.java) | Exception representation or response handling |
| [GlobalExceptionHandler.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/exception/GlobalExceptionHandler.java) | Exception representation or response handling |

### enums

| File | Role |
| --- | --- |
| [ErrorCode.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/enums/ErrorCode.java) | Domain constants |
| [Role.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/enums/Role.java) | Domain constants |
| [UserStatus.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/enums/UserStatus.java) | Domain constants |

### util

| File | Role |
| --- | --- |
| [JwtUtil.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/util/JwtUtil.java) | Shared JWT utility |

Application entry: [MusicappApplication.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/MusicappApplication.java).

## Build, infrastructure, configuration, and existing guides

| File | Purpose |
| --- | --- |
| [docker-compose.yml](../workspace/docker-compose.yml) | Root full-stack Compose and destructive optional import tool |
| [USECASES.md](legacy-usecases.md) | Earlier Vietnamese use-case notes; compare with source-based behavior guide |
| [frontend_MussicApp/package.json](../package.json) | Declared frontend versions and commands |
| [frontend_MussicApp/package-lock.json](../package-lock.json) | Exact npm dependency resolution |
| [frontend_MussicApp/index.html](../index.html) | Vite browser HTML entry |
| [frontend_MussicApp/vite.config.js](../vite.config.js) | Build alias and development API proxy |
| [frontend_MussicApp/eslint.config.js](../eslint.config.js) | Frontend lint configuration |
| [frontend_MussicApp/tailwind.config.js](../tailwind.config.js) | Tailwind configuration |
| [frontend_MussicApp/postcss.config.js](../postcss.config.js) | PostCSS configuration |
| [frontend_MussicApp/tsconfig.json](../tsconfig.json) | TypeScript/editor resolution settings |
| [frontend_MussicApp/tsconfig.node.json](../tsconfig.node.json) | Node-side TypeScript configuration |
| [frontend_MussicApp/Dockerfile](../Dockerfile) | Frontend multi-stage container build |
| [frontend_MussicApp/nginx.conf](../nginx.conf) | Container API proxy and SPA fallback |
| [frontend_MussicApp/vercel.json](../vercel.json) | Hosted API rewrite and SPA fallback |
| [frontend_MussicApp/.gitignore](../.gitignore) | Frontend ignored files |
| [frontend_MussicApp/.dockerignore](../.dockerignore) | Frontend Docker build context exclusions |
| [frontend_MussicApp/README.md](../README.md) | Frontend setup, design structure and verification commands |
| [frontend_MussicApp/LIKE_FEATURE.md](../LIKE_FEATURE.md) | Earlier favorites notes |
| [frontend_MussicApp/HISTORY_FEATURE.md](../HISTORY_FEATURE.md) | Earlier history notes |
| [frontend_MussicApp/UI_COMPONENTS_GUIDE.md](../UI_COMPONENTS_GUIDE.md) | Earlier shared UI component guide |
| [backend_MusicApp/pom.xml](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/pom.xml) | Backend dependency and build declarations |
| [backend_MusicApp/mvnw](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/mvnw) | Unix Maven wrapper |
| [backend_MusicApp/mvnw.cmd](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/mvnw.cmd) | Windows Maven wrapper |
| [backend_MusicApp/.mvn/wrapper/maven-wrapper.properties](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/.mvn/wrapper/maven-wrapper.properties) | Maven wrapper distribution configuration |
| [backend_MusicApp/Dockerfile](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/Dockerfile) | Backend jar build, runtime, healthcheck |
| [backend_MusicApp/compose.yaml](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/compose.yaml) | Alternative infrastructure Compose |
| [backend_MusicApp/compose.dev.yml](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/compose.dev.yml) | Infrastructure for local API development |
| [backend_MusicApp/docker-scripts.sh](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/docker-scripts.sh) | Earlier Docker convenience commands; inspect before running |
| [backend_MusicApp/DOCKER.md](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/DOCKER.md) | Earlier Docker instructions |
| [backend_MusicApp/.github/workflows/deploy.yml](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/.github/workflows/deploy.yml) | Configured ECR/ECS deployment workflow |
| [backend_MusicApp/.gitignore](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/.gitignore) | Backend ignored files |
| [backend_MusicApp/.dockerignore](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/.dockerignore) | Backend Docker build context exclusions |
| [backend_MusicApp/src/main/resources/application.yml](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/resources/application.yml) | Common Spring configuration |
| [backend_MusicApp/src/main/resources/application-dev.yml](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/resources/application-dev.yml) | Development overrides |
| [backend_MusicApp/src/main/resources/application-prod.yml](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/resources/application-prod.yml) | Production overrides |
| [backend_MusicApp/src/main/resources/schema.sql](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/resources/schema.sql) | PostgreSQL structure-and-data dump; not an incremental migration |
| [backend_MusicApp/src/main/resources/schema_1.sql](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/resources/schema_1.sql) | Manual bootstrap SQL; not root Compose initialization source |
| [backend_MusicApp/src/main/resources/META-INF/additional-spring-configuration-metadata.json](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/resources/META-INF/additional-spring-configuration-metadata.json) | Custom configuration metadata |
| [backend_MusicApp/src/test/java/nhantr/musicapp/MusicappApplicationTests.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/test/java/nhantr/musicapp/MusicappApplicationTests.java) | Single application context smoke test |

## Excluded material

Frontend assets/public icons and template screenshots are visual resources. Backend data/*.db are old database artifacts. Root .github Java-upgrade hook files support development tooling. Their presence does not add application routes, business APIs, or a tested deployment. Private .env/.env.local values were intentionally not copied; the setup guide documents configuration names from source.

## Frontend redesign verification files

| File | Purpose |
| --- | --- |
| [playwright.config.js](../playwright.config.js) | Browser configuration and local dev server |
| [queue.test.js](../tests/queue.test.js) | Pure queue, repeat and shuffle tests |
| [redesign.spec.js](../tests/browser/redesign.spec.js) | Responsive, interaction and regression browser tests |
| [fixtures.js](../tests/browser/fixtures.js) | Test-only local API, artwork and silent audio fixtures |

See [current redesign guide](14-frontend-redesign.md) for component ownership and [preview gallery](redesign-previews/README.md) for the 24 screenshots.
