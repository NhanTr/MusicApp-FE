export const songKey = (song) => song?.id || song?._id;

export function createQueue(songs = [], selected) {
  const seen = new Set();
  const queue = songs.filter((song) => {
    const id = songKey(song);
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  if (songKey(selected) && !seen.has(songKey(selected)))
    queue.unshift(selected);
  return queue;
}

export function nextQueueIndex(index, length, repeat = "none") {
  if (!length) return -1;
  if (repeat === "one") return index;
  if (index + 1 < length) return index + 1;
  return repeat === "all" ? 0 : -1;
}

export function shuffleQueue(songs, selected, random = Math.random) {
  const rest = createQueue(songs, selected).filter(
    (song) => songKey(song) !== songKey(selected),
  );
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return selected ? [selected, ...rest] : rest;
}
