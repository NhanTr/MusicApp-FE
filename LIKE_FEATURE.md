# Favorite/Like Feature Documentation

## Overview
Added heart icon (like button) functionality to favorite songs throughout the app. Users can now like/unlike songs with a single click.

## Components

### LikeButton Component
**Location**: `src/components/LikeButton.jsx`

A reusable button component that displays a heart icon and handles like/unlike functionality.

**Props**:
- `songId` (required) - The ID of the song
- `initialLiked` (optional, default: false) - Whether the song is initially liked
- `onLikeChange` (optional) - Callback function when like status changes

**Features**:
- Filled red heart when song is liked
- Outline heart when song is not liked
- Loading state during API call
- Error handling with console logging
- Prevents parent click handlers from triggering (uses stopPropagation)
- Smooth transitions and hover effects

**Usage**:
```jsx
import LikeButton from '@/components/LikeButton'

<LikeButton 
  songId={song.id} 
  initialLiked={false}
  onLikeChange={(isLiked) => {
    // Update parent state
  }}
/>
```

## Updated Components

### 1. Trending.jsx
**Features Added**:
- Like button appears on hover (opacity transition)
- Loads user's favorite songs on mount
- Updates local `likedSongs` state when user likes/unlikes
- Heart button positioned on the right side of song items

### 2. SearchPage.jsx
**Features Added**:
- Like button in search results for songs
- Shows only when hovering over song row
- Loads favorites on mount
- Updates liked songs state

### 3. History.jsx
**Features Added**:
- Like button next to delete button in history items
- Appears on hover with delete button
- Loads user's favorite songs on mount
- Allows users to like songs from their history

### 4. Favorites.jsx
**Note**: Already had unlike functionality via delete button, no changes needed

## API Integration

The feature uses the existing `favoritesApi` from `src/lib/api.js`:
- `favoritesApi.getFavorites(params)` - Get list of favorite songs
- `favoritesApi.likeSong(songId)` - Add song to favorites (POST)
- `favoritesApi.unlikeSong(songId)` - Remove song from favorites (DELETE)

## User Experience

1. **Loading State**: 
   - Button is disabled during API call
   - Opacity reduced to show disabled state

2. **Visual Feedback**:
   - Red filled heart for liked songs
   - Gray outline heart for unliked songs
   - Smooth color transitions on hover

3. **Error Handling**:
   - Errors logged to console (non-intrusive)
   - User can retry by clicking button again

4. **Performance**:
   - Favorites loaded once on component mount
   - Set data structure used for O(1) lookup
   - Prevents unnecessary re-renders with Set comparison

## Backend Requirements

Ensure the backend API endpoints are working:

```
POST   /api/favorites/{songId}     - Like a song
DELETE /api/favorites/{songId}     - Unlike a song
GET    /api/favorites              - Get all favorite songs (supports pagination)
```

## Future Enhancements

1. **Persistent UI**: Could remember scroll position and liked songs between pages
2. **Real-time Sync**: Use WebSocket to sync favorite status across browser tabs
3. **Analytics**: Track which songs are most liked
4. **Recommendations**: Use favorite patterns to improve recommendations
5. **Social Sharing**: Share favorite songs with friends

## File Locations

- **Component**: `src/components/LikeButton.jsx`
- **Updated Features**:
  - `src/features/songs/Trending.jsx`
  - `src/features/search/SearchPage.jsx`
  - `src/features/history/History.jsx`
  - `src/features/favorites/Favorites.jsx` (no changes, already had unlike)

## Testing

To test the feature:

1. Navigate to Trending page - like/unlike songs
2. Go to Search page - like songs from search results
3. Check History page - like songs from listening history
4. Go to Favorites page - verify liked songs appear
5. Navigate between pages - verify like state persists

## Notes

- Like status is loaded from backend on component mount
- Like/unlike operations are immediate (optimistic update possible in future)
- Heart button uses Lucide React Heart icon
- All styling uses Tailwind CSS classes
- Component follows existing project patterns and conventions
