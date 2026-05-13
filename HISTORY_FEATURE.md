# Listening History Feature

## Overview
Automatically saves every song played to the user's listening history. Each time a user clicks on a song to play it, the song is recorded in the database.

## How It Works

### MusicContext Enhancement
**Location**: `src/contexts/MusicContext.jsx`

The MusicContext now intercepts all `setCurrentSong` calls and:
1. Updates the current song for playback
2. Sends the song info to the backend history API
3. Records timestamp automatically on the backend

### Implementation Details

```javascript
const handleSetCurrentSong = useCallback((song) => {
  if (!song) {
    setCurrentSong(null)
    return
  }

  // Set current song for playback
  setCurrentSong(song)

  // Add to history asynchronously (non-blocking)
  const addToHistory = async () => {
    try {
      const payload = {
        songId: song.id || song._id,
        title: song.title || song.name,
        artist: typeof song.artist === 'string' ? song.artist : song.artist?.name,
        duration: song.duration
      }
      await historyApi.addHistory(payload)
    } catch (err) {
      // Silent fail - don't disrupt playback
      console.error('Error adding to history:', err)
    }
  }

  addToHistory()
}, [])
```

## Features

✅ **Automatic Recording**: No user action needed, happens automatically when song is played
✅ **Non-Blocking**: History is saved asynchronously, doesn't affect playback
✅ **Error Handling**: If history save fails, playback continues (graceful degradation)
✅ **No Duplicates Prevention**: Each play is recorded separately (maintains play count)
✅ **Backend Integration**: Works with existing historyApi

## Affected Components

All components that call `setCurrentSong` will automatically add songs to history:
- ✅ Trending.jsx
- ✅ SearchPage.jsx
- ✅ History.jsx (when replaying from history)
- ✅ Favorites.jsx (when playing from favorites)
- ✅ MusicPlay.jsx (when using next/previous controls)
- ✅ Any other component that plays songs

## API Integration

Uses existing `historyApi.addHistory()` endpoint:

```javascript
POST /api/history
Body: {
  songId: number,
  title: string,
  artist: string,
  duration: number
}
```

## User Experience

1. **Seamless**: User doesn't need to do anything special
2. **Reliable**: Even if history save fails, music still plays
3. **Complete**: All songs played through the app are recorded
4. **Visible**: Users can view their history anytime on History page

## Data Flow

```
User clicks song
    ↓
setCurrentSong() called
    ↓
MusicContext intercepts call
    ↓
Updates currentSong state
    ↓
Asynchronously calls historyApi.addHistory()
    ↓
Song recorded in database with timestamp
    ↓
History available in History.jsx
```

## Backend Requirements

The backend API endpoint must:
1. Accept POST request with song data
2. Add timestamp automatically
3. Associate with current user (via JWT token)
4. Handle errors gracefully

Example expected response:
```json
{
  "code": 200,
  "message": "History added successfully",
  "data": {
    "id": 123,
    "songId": 1,
    "userId": 1,
    "title": "Song Title",
    "artist": "Artist Name",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## Testing

To test this feature:

1. **Play a song**:
   - Navigate to Trending page
   - Click on any song
   - Song should start playing

2. **Verify history saved**:
   - Open browser DevTools (F12)
   - Check Network tab
   - Look for POST request to `/api/history`
   - Should see response status 200/201

3. **Check History page**:
   - Navigate to History page
   - Should see the songs you just played
   - Songs should appear in reverse chronological order (most recent first)

4. **Play multiple songs**:
   - Play several songs
   - Each should create a new history entry
   - Even replaying the same song creates a new entry

## Performance Considerations

- History save is asynchronous (non-blocking)
- No retry mechanism - if it fails once, it's silently logged
- No caching - each play makes an API call
- Potential for high API load if many songs played rapidly

## Future Improvements

1. **Debouncing**: Prevent adding same song within X seconds
2. **Batching**: Group multiple plays before sending to backend
3. **Offline Support**: Store locally and sync when online
4. **Analytics**: Track listening patterns
5. **Recommendations**: Use history to improve recommendations
6. **Social Features**: Share listening history or top songs

## Files Modified

- `src/contexts/MusicContext.jsx` - Added history integration

## Troubleshooting

**History not saving?**
- Check if `/api/history` endpoint is working
- Verify JWT token is valid (should be auto-included)
- Check browser console for error messages
- Verify user is authenticated

**Duplicate entries?**
- This is normal - each play creates a new entry
- Use backend deduplication if needed (e.g., don't record same song within 1 minute)

**Performance issues?**
- Consider implementing debouncing
- Add backend rate limiting
- Consider batch processing

## Notes

- Initial song loaded when app starts is NOT recorded (only explicit user plays)
- Plays from auto-play (next song) ARE recorded (handled same way as manual clicks)
- History entries include song metadata for quick reference
- Timestamps are created on backend (server time is authoritative)
