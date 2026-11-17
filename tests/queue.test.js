import test from "node:test";
import assert from "node:assert/strict";
import { createQueue, nextQueueIndex, shuffleQueue } from "../src/lib/queue.js";
const songs = [{ id: "a" }, { id: "b" }, { id: "c" }];
test("collection queue preserves selected order, drops missing and duplicate ids", () => {
  assert.deepEqual(
    createQueue([songs[0], null, songs[1], songs[0]], songs[1]),
    [songs[0], songs[1]],
  );
});
test("selection from outside the collection is prepended without losing tracks", () => {
  assert.deepEqual(
    createQueue(songs, { id: "d" }).map((s) => s.id),
    ["d", "a", "b", "c"],
  );
});
test("repeat none stops at final track, repeat all wraps, repeat one stays", () => {
  assert.equal(nextQueueIndex(2, 3, "none"), -1);
  assert.equal(nextQueueIndex(2, 3, "all"), 0);
  assert.equal(nextQueueIndex(1, 3, "one"), 1);
  assert.equal(nextQueueIndex(0, 0, "all"), -1);
});
test("shuffle retains selected track first, preserves membership and does not mutate input", () => {
  const result = shuffleQueue(songs, songs[1], () => 0);
  assert.equal(result[0].id, "b");
  assert.deepEqual(result.map((s) => s.id).sort(), ["a", "b", "c"]);
  assert.deepEqual(
    songs.map((s) => s.id),
    ["a", "b", "c"],
  );
});
