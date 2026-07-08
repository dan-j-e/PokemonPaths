# Pokemon Fan Game — Design Document

Living document. Update this every design session. Move settled items out of "Open Questions" into their proper section.

## Overview

A browser-playable, direct Pokemon fan game (real species, names, mechanics — personal/non-commercial). Oversimplified mainline formula with a roguelike-lite run structure.

## Tech Stack

- TypeScript
- Phaser 3 (browser game engine)
- Vite (dev server + build)

## IP Approach

Direct fan game: uses actual Pokemon species, names, and mechanics as closely as possible. Personal, non-commercial project.

## Phase 1 Region

Sinnoh, following its real map and route order (not randomized yet).

## Run Structure

- **Start**: player begins in Twinleaf Town and **chooses** a starter (Turtwig, Chimchar, or Piplup) — this replaced the earlier "random starter" idea once the full story outline was mapped out.
- The run follows a fixed, ordered sequence of **segments** (see Story Progression below), each either a `battle` segment (fixed story beat) or a `non-battle` segment (1-3 actions).
- **Non-battle segments**: show 3-4 possible actions (Use X-Attack, catch, find item, interact). The player either picks exactly 1 to perform, or hits "spin" to randomly get 2 of those actions instead of choosing.
- **Battle segments**: fixed story beats — rival (Barry), Team Galactic grunts/commanders, gym leaders, Elite Four, Champion.
- **End of run**: Elite Four, then Champion (Cynthia).

## Loss Rules

- Losing a **gym**, **Elite Four**, or **Champion** battle ends the run.
- Losing to **Barry**, a **Team Galactic grunt**, or a **Commander** (Mars/Jupiter/Saturn/Cyrus) has no penalty — same as a route battle loss, the run just continues.

## Story Progression (Phase 1 — Sinnoh, trimmed for a 5-10 minute run)

Originally a 37-segment full mainline mapping (18 battles, 19 non-battle) — realistically 15-20+ minutes to play. Trimmed to **23 segments (13 battle, 10 non-battle)** to hit a 5-10 minute target, per the user's "too many meaningless battles and segments" call. Encoded in `game/src/data/segments.ts`.

**Battle cuts**: removed Jubilife Grunt, Jubilife Mars, Celestic Grunt, Lake Valor (Saturn), and Lake Verity (Mars) entirely — all redundant repeats of the same commanders with near-identical rosters. Simplified Veilstone's triple battle (Saturn+Jupiter+Cyrus) down to solo Cyrus. The Team Galactic arc is now exactly 3 beats: **Valley Windworks (Mars)** → **Veilstone (Cyrus)** → **Spear Pillar (full Mars+Jupiter+Cyrus triple, climax)**. Barry, all 8 gyms, and the Elite Four/Champion league are untouched.

**Non-battle merges**: every run of consecutive non-battle segments created by the battle cuts above was collapsed into one combined segment (pooling their wild-encounter tables) — since every "stop" is now a single segment, the old "no more than 2 non-battle in a row" pacing rule is trivially satisfied everywhere; it's no longer a rule that needs checking, just an outcome of the merge. Route 210 North, Route 218, and Mt. Coronet (pre-Spear Pillar) stay standalone since battle cuts left them bounded by battles on both sides already.

Full trimmed sequence: Twinleaf Town (starter + Barry) → Route 201-203 & Oreburgh Gate → Oreburgh City (Gym 1: Roark) → Route 204 & Floaroma Town → Valley Windworks (Mars) → Route 205 & Eterna Forest → Eterna City (Gym 2: Gardenia, then Jupiter) → Mt. Coronet Crossing & Hearthome Outskirts → Veilstone City (Gym 3: Maylene) → Route 213 & 214 → Pastoria City (Gym 4: Crasher Wake) → Route 210 North → Hearthome City (Gym 5: Fantina) → Route 218 → Canalave City (Gym 6: Byron) → Mt. Coronet & Routes 216-217 → Snowpoint City (Gym 7: Candice) → Veilstone City (Cyrus) → Mt. Coronet → Spear Pillar (Mars, Jupiter, Cyrus, legendary encounter) → Sunyshore City (Gym 8: Volkner) → Route 223 & Victory Road → Pokemon League (Elite Four: Aaron, Bertha, Flint, Lucian, then Champion Cynthia).

Battle rosters for every trainer are in `game/src/data/trainers.ts`. Wild encounter tables for the merged segments pool their constituent locations' original tables (`game/src/data/encounters.ts`).

## Battle & Catch System

Modeled on **zeroxm/pokemon-roulette** (github.com/zeroxm/pokemon-roulette) — a weighted-wheel spin where team power and type advantage shift the odds without guaranteeing the outcome. No stats or movesets.

**Species data** (`game/src/data/species.ts`): every species has real type(s) (well-known Pokemon facts) and either a Bulbapedia catch rate (wild-encounterable species) or a manually-assigned `power` (trainer-only species that are never wild-caught, e.g. gym/Elite Four/Champion mons — judgment call, not Bulbapedia-sourced).

**Power**: wild species derive `power` (1-8) from their catch rate — rarer/harder to catch → higher power, mirroring zeroxm's own power range. Trainer-only species get power hand-assigned by evolutionary stage/battle-tier.

**Type effectiveness** (`game/src/data/typeChart.ts`): standard Gen 4 17-type chart (no Fairy — doesn't exist yet). A Pokemon's own type(s) double as its offense (no separate moves). Dual types multiply defensively as normal.

**Wild encounters & catching** (`game/src/data/encounters.ts`): each non-battle segment has a weighted species table simplified from Bulbapedia's Diamond/Pearl encounter data. Simplifications made deliberately:
- Only base grass/cave land encounters — dropped surf, fishing rods, swarms, Poke Radar, dual-slot, and time-of-day/Diamond-vs-Pearl version splits (none of that is modeled in this game).
- Multi-location merged segments (Mt. Coronet Crossing, Hearthome Outskirts) pool their constituent locations' tables.
- For routes with Bulbapedia North/South sub-areas, only one representative sub-area's table was used rather than blending both.
- A few species that turned up in encounter research but weren't in the original catch-rate research pass got catch rates filled from general Pokemon knowledge instead of a second research call (noted here, not hidden).
- Catching: land on a wild encounter, the game rolls a species from the table, then rolls a catch attempt at `catchRate / 255` (clamped 10%-95%) — a simplified stand-in for the real HP/ball-based Gen IV formula, which needs mechanics (HP, Poke Balls) this game doesn't have. Success adds the species to the active team (max 6) or the bench, up to a **total roster cap of 12** (added during the bug-sweep pass — nothing previously stopped bench growth from pushing past the visible screen); beyond the cap, a successful catch reports "your party is full" instead of adding it. Failure has no penalty (per the user: revisit later if that should change).

**Battles** (`game/src/battle/roulette.ts`, `TeamManagementScene`, `BattleScene`): before every battle, `TeamManagementScene` shows the player's active team and bench alongside the opponent's roster, and lets the player reorder the active lineup or swap in bench Pokemon. `BattleScene` then computes a lead-vs-lead type matchup tier (overwhelming/advantage/neutral/disadvantage/overwhelmed), builds win/lose weights (`1 + total active team power + type bonus + X-Attack bonus` vs. `1 + battle tier weight×2 + type penalty`), shows a win%/lose% bar, and a "Spin" button resolves the outcome. The existing run-ending rule (gym/Elite Four/Champion loss ends the run; everything else has no penalty) still applies on a loss.

## Items

Three consumables (`game/src/data/items.ts`), found via the "look for an item" action (weighted: X-Attack common, Potion less common, Revive rare — rarity matches impact):
- **X-Attack**: used proactively during a non-battle segment (the "heal" action slot was repurposed into "Use X-Attack" since there's no HP system to heal) — queues a win-odds bonus (`pendingBoost`) consumed by the very next battle only, then cleared regardless of outcome.
- **Revive**: used only after losing a run-ending battle (gym/Elite Four/Champion) — retries that exact battle immediately with the same lead Pokemon.
- **Potion**: used only after losing a run-ending battle — retries the battle, but routes through `TeamManagementScene` first with `mustChangeLeadFrom` set, which blocks continuing until the active lead is no longer the Pokemon that just lost.

Shop/currency stays deferred (not built) — items only come from the "find item" action, not purchased.

## Interact & Route Battles

The "interact" action (`game/src/data/routeTrainers.ts`, `ActionScene`) replaced the old "lore" flavor stub. Rolls a three-way outcome, equal weight: a trainer battle, an item find, or nothing.

- **Route trainer battles**: a one-off `BattleSpec` generated on the fly — 1-2 species pulled from that segment's own `ENCOUNTER_TABLES` (a Route 201 trainer uses Starly/Bidoof; falls back to Bidoof if the segment has no table), a random generic name (Youngster/Lass/Hiker/Bug Catcher), `tier: 1` (weakest, same as grunts/rival), `runEnding: false` — losing has no penalty, same as any non-story battle. Winning currently gives nothing extra beyond the win itself; that's intentionally left for the evolution system (next up) to give "getting stronger" real teeth.
- **Manual vs. spin**: clicking "Interact" deliberately, if it rolls a battle, sends the player through the full `TeamManagementScene` → `BattleScene` flow (reorder, see the odds bar, hit Spin) via `RunState.adHocBattle`. If "interact" is instead reached through the random Spin-two-actions path, a battle outcome resolves instantly in the background (odds computed once, single spin, reported as a text line) — no scene transition, mirroring how spin-triggered catches already skip the manual "throw a Poke Ball" step.
- `BattleScene`/`TeamManagementScene` read `adHocBattle` in preference to a segment's static battle list, and `BattleScene` routes ad-hoc battles straight back to the next segment on resolution (they're never part of a multi-battle segment chain).

Trade is a planned fourth interact outcome, not built yet.

## Visuals

- **Pokemon sprites**: loaded at runtime from PokeAPI's public sprite CDN (`raw.githubusercontent.com/PokeAPI/sprites`) by National Dex number — the same source zeroxm/pokemon-roulette uses. Pixel-art sprites only, everywhere (starter select, battle, team management) — the official-artwork variant was tried for starter select but dropped per the user's preference for pixel art throughout. See `game/src/data/sprites.ts`.
- **Trainer sprites**: skipped — no equivalent clean free source. Trainers stay text-only.
- **Location themes** (`game/src/data/locationThemes.ts`): each segment has a base color matching its real personality (e.g. Hearthome purple like Fantina, Jubilife beige/silver as the media city, Snowpoint icy blue, Victory Road dramatic red). Not a walkable tile map — still card-based screens, just themed.
- **Layered backgrounds** (`game/src/ui/background.ts`): `drawNeoBackground(scene, baseColor)` replaced the old flat `setBackgroundColor` fills (which read as generic dark-RPG rather than neon per a UX audit) — a vertical gradient from the location's base color up to a lifted/purple-tinted top, plus a sparse low-alpha cyan/purple grid overlay, giving actual depth instead of a paint-bucket fill. `drawPanel(scene, x, y, w, h)` adds semi-transparent rounded panels behind grouped content (team/bench/opponent lists in Team Management, the odds-bar area in Battle) so screens read as organized zones instead of loose floating text.
- **Progress bar** (`game/src/ui/progressBar.ts`): a vertical badge-case track on the right edge of every screen (Overworld, Action, Team Management, Battle) — 8 gym pips light up as each gym is passed, a Champion star sits at the top, both now with "Badges"/"Champion" text labels (previously unlabeled shapes/glyph). Purely derived from `segmentIndex` and each gym segment's `isGym` flag/position — no separate progress state to track.
- **"Neo Tokyo" theme** (`game/src/ui/theme.ts`): classic cyberpunk neon palette — near-black background (`#0a0a12`), light lavender text, hot pink primary (`#ff2e88`), cyan secondary (`#00e5ff`), purple tertiary (`#9d4edd`), acid green success / red danger. Two colors (`textMuted`, `buttonDisabledText`) were lightened after a QoL audit found them dipping below 4.5:1 contrast on some location backgrounds. `game/src/ui/button.ts` draws rounded, solid-neon-filled buttons; the Battle odds bar and progress-bar track were rounded to match (previously hard-cornered, an inconsistent corner language against the buttons). `GameOverScene` and `VictoryScene` get their own near-black red/purple backgrounds and bigger primary/secondary-colored headlines as the run's dramatic endpoints.
- **Typography**: Google Fonts "Orbitron" (titles/headers) and "Share Tech Mono" (body text) replaced the default browser monospace everywhere, for a more deliberately sci-fi look.
- **Sprites**: `pixelArt: true` added to the Phaser game config (nearest-neighbor filtering everywhere) fixes blur/mush on both the starter-select upscale and the Team Management downscale. Battle lead sprites bumped 96→128px with a soft colored glow circle behind each (previously small and isolated against empty background); Team Management icons bumped 28→36px.

## Evolution & Training

No XP/levels, so evolution is driven by **win-count as active lead** (`game/src/data/evolutions.ts`):

- A Pokemon evolves after being the winning lead in **2 battles** — story, ad-hoc route battle, manual or spin-resolved, all count the same. This applies uniformly regardless of the real games' method (level/stone/trade/happiness) — a deliberate simplification consistent with the rest of the project.
- Hitting the threshold shows a **Yes/No prompt** ("‹X› wants to evolve into ‹Y›!"), never automatic — including for spin-instant-resolved interact battles, which normally skip scene transitions entirely but still interrupt for this. Declining just means it's offered again next qualifying win (no extra state tracked).
- **No stage is skipped.** Wurmple is the one branch point in the current roster: 2 wins gives a 50/50 pick between Silcoon and Cascoon (both added to the species catalog rather than skipped), then 2 more wins evolves deterministically into Beautifly or Dustox respectively, matching the real games. Any future branch point gets the same treatment — equal odds, every option modeled.
- **EXP Share**: a rare 4th "find item" outcome, permanent once found (`RunState.hasExpShare`, a Key-Item-style boolean, not a stackable count) — from then on, every win also gives every other active team member +0.33 toward their own win-count.
- Shared logic (`applyBattleWin`, `applyEvolution`) is reused by both win paths (`BattleScene` and `ActionScene`'s instant spin-resolve) so the rules can't drift between them.
- Added 13 evolution-only species to `species.ts` to complete reachable chains for wild/starter species (Grotle/Torterra, Monferno, Prinplup/Empoleon, Luxio, Roselia, Machamp, Haunter, Chimecho, Staraptor, Silcoon, Cascoon) — manual power, same pattern as other never-wild trainer-only entries.

## Meta-Progression

None in Phase 1. Every run starts from a blank slate. Persistent unlocks (currency, starter unlocks, permanent upgrades) are explicitly deferred until after the base game exists.

## Future Direction (queued, in this order)

1. **Poke Ball variety** — different ball types with different catch-odds multipliers, extending the current flat `catchRate/255` formula.
2. Trade as a fourth "interact" outcome.
3. Region randomization or player-selectable region.
4. Meta-progression systems between runs.
5. A full walkable tile-based overworld with a region minimap showing player position (explicitly deferred — to be considered once more of the map/UI exists).

## Open Questions

- Whether losing a route/rival/commander battle should carry any minor consequence later (currently: none).
- Whether fainted/lost Pokemon should ever leave the team (currently: team composition never shrinks; only run-ending losses matter).
- Shop/currency system — deferred ("keep in mind, not yet"); items currently only come from the "find item" action.
- Further visual "juice" (animation, transitions, particle effects) beyond the static neo Tokyo color/shape reskin — not requested yet, flagged as a possible future pass.
- A QoL audit found zero in-game tutorial text anywhere; this session added small always-visible captions for the mechanics most likely to confuse a first-time player (lead-only matchup, reorder-affects-odds, evolution effect, catch % after auto-resolve) rather than a dismissible one-time tutorial — simpler, no extra state to track, but worth revisiting if it still isn't enough guidance.

## Changelog

- 2026-07-07: Initial kickoff session. Established tech stack, IP approach, Phase 1 region (Sinnoh), run structure, loss rules, and deferred meta-progression/repo setup. Scaffolded TypeScript+Phaser+Vite skeleton in `game/`.
- 2026-07-07: Built the full Sinnoh story progression as a playable click-through prototype. Encoded the finalized (post-reduction) segment list and trainer rosters as data, and implemented starter select, overworld, action, battle, game-over, and victory scenes in Phaser. Confirmed starter selection is player-chosen, not random (supersedes the kickoff session's "random starter" note).
- 2026-07-07: Connected the project to a local git repository (no remote).
- 2026-07-07: Replaced the battle Win/Lose stub with a real roulette mechanic (modeled on zeroxm/pokemon-roulette) and made catching real, grounded in Bulbapedia encounter/catch-rate data with documented simplifications. Added `TeamManagementScene` for pre-battle team reordering and bench swaps.
- 2026-07-07: Added real Pokemon sprites (PokeAPI CDN) to starter select, battles, and team management, plus dark per-location background themes matching each city's real personality.
- 2026-07-07: Switched starter select to pixel-art sprites (dropped the official-artwork variant) so sprite style is consistent everywhere.
- 2026-07-07: Added real items — X-Attack (pre-battle win-odds boost), Potion and Revive (retry a lost run-ending battle, with or without a forced lead change). Shop/currency and general visual polish noted as future work, not urgent.
- 2026-07-07: Replaced "lore" with "interact" — resolves to a generated route trainer battle (reusing the existing roulette engine via `RunState.adHocBattle`), an item find, or nothing. Queued next: evolution, then Poke Ball variety, then trade as interact's fourth outcome.
- 2026-07-07: Trimmed the run from 37 to 23 segments (13 battle, 10 non-battle) to hit a 5-10 minute target — cut 5 redundant Team Galactic battles, simplified Veilstone's triple to solo Cyrus, merged every resulting run of non-battle segments into one each. Added a right-side progress bar (8 gym badges + Champion star). Re-sequenced the future queue: evolution/training next, then a "neo Tokyo" UI reskin, then Poke Ball variety.
- 2026-07-07: Added the evolution system — win-count-as-lead trigger (2 wins), Yes/No prompt (even on instant spin-resolved wins), full un-skipped Wurmple branch (added Silcoon/Cascoon), and the permanent EXP Share item. Added 13 evolution-only species to complete reachable chains.
- 2026-07-08: Applied the "neo Tokyo" UI reskin — cyberpunk neon palette (`ui/theme.ts`), rounded solid-neon buttons (`ui/button.ts`), restyled progress bar/battle odds bar/all scene text colors, dramatic Game Over/Victory endpoints. Per-location background colors kept as-is per the user's direction (neon chrome layered on top, not a replacement).
- 2026-07-08: Full bug-sweep pass (3 parallel audits: data layer, scene/UI layout, end-to-end gameplay logic) before starting Poke Ball variety. Fixed two game-breaking issues — a "Give up" button that could render off-canvas when holding both Revive and Potion, and a soft-lock where "Use Potion" could demand an unsatisfiable lead change with a 1-member team and empty bench (now gated on it actually being possible). Fixed a real evolution-system bug: EXP-Share-boosted non-lead teammates could visibly reach the win threshold but never get an evolve offer (`applyBattleWin` only checked the lead). Fixed several visual overlaps (BattleScene title/sprite, Team Management opponent-roster text running into the progress bar, team/bench row text crowding its own buttons, evolve-prompt button spacing in both scenes). Added a 12-Pokemon total roster cap. Rewrote `locationThemes.ts` (stale since the segment-trim session — 9 of 23 current segments had no entry and silently used a mismatched default color) and removed dead code (4 orphaned species, an unreachable evolution entry, a latent empty-array crash risk in the encounter-table fallback). The 4 removed species (`Barboach`, `Croagunk`, `Houndour`, `Toxicroak`) were restored at the user's request, unreferenced for now until made accessible.
- 2026-07-08: Visual & UX overhaul following a "still not clean/sharp/neo" QoL review (2 parallel audits: visual/background cohesion, UX/accessibility). Replaced flat per-scene `setBackgroundColor` fills with layered gradient+grid backgrounds (`ui/background.ts`) and added grouping panels around team/bench/opponent lists and the battle odds bar — the audits' consensus root cause was that solid near-black fills with no texture, plus fully-saturated neon buttons floating directly on them with no grouping, was what read as "not neo" rather than any single color choice. Fixed a real `TeamManagementScene` bug: a full 6-team/6-bench roster could overlap the last "Swap in" button with the footer warning text and Continue button (tightened row spacing, shortened button labels). Added Google Fonts (Orbitron/Share Tech Mono) and `pixelArt: true` (fixes sprite blur/mush), bumped sprite sizes, labeled the progress bar, lightened two under-contrast theme colors, fixed the opponent-roster text's color-on-color accessibility issue, fixed a disabled-button affordance mismatch, and added minimal always-visible captions for previously unexplained mechanics (lead-only matchup, reorder-affects-odds, evolution effect, post-hoc catch %).
