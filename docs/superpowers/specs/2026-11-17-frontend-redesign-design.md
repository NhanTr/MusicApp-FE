# MusicFlow reference redesign

The user authorized implementation with independent design judgment after review of all 24 template screenshots. Apply their near-black/olive surfaces, lime accent, warm white type, editorial collection heroes, thin dividers, compact track rows, sidebar, fixed player, responsive mobile navigation, empty/search states, and overlay queue across the existing frontend. Keep MusicFlow branding, Vietnamese copy, React/Vite, existing routes, and API contracts. Use real API artwork, with decorative local fallbacks when missing; do not present screenshot-specific HVL data or lossless claims as real catalog facts.

Approach: rebuild shared navigation/player and reusable collection components, migrate existing forms/admin/catalog styling to coherent semantic colors, and rebuild key listening pages using shared components. A CSS-only recolor would not reproduce the reference layout/queue; a separate static clone would discard working features. Implement in the current checkout, preserving existing local edits and avoiding backend changes. No additional design approvals or worktree setup are needed under the user's direction to proceed.

Desktop uses a 218px sidebar and bottom player, tablet retains a compact sidebar and hides supplementary artwork, mobile uses a top nav/menu and two-row player. Queue opens above the player, with Escape/close controls. Existing upload/add-to-playlist/password/admin operations remain connected. Do not introduce fake catalog data on network failure.

Validate queue/repeat/shuffle utilities, production build, lint in touched files, and browser rendering/interactions at 1440/768/390px with explicit API fixtures. Report runtime/backend limits and any remaining baseline lint issues.
