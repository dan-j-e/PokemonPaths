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
- **Non-battle segments**: show 3-4 possible actions (heal/shop, catch, item, lore/talk). The player either picks exactly 1 to perform, or hits "spin" to randomly get 2 of those actions instead of choosing.
- **Battle segments**: fixed story beats — rival (Barry), Team Galactic grunts/commanders, gym leaders, Elite Four, Champion.
- **End of run**: Elite Four, then Champion (Cynthia).

## Loss Rules

- Losing a **gym**, **Elite Four**, or **Champion** battle ends the run.
- Losing to **Barry**, a **Team Galactic grunt**, or a **Commander** (Mars/Jupiter/Saturn/Cyrus) has no penalty — same as a route battle loss, the run just continues.

## Story Progression (Phase 1 — Sinnoh)

Full segment list derived from the mainline Diamond/Pearl progression, encoded in `game/src/data/segments.ts`. Applies the pacing rule: **no more than 2 non-battle segments allowed back-to-back.** Checking the raw outline against this rule surfaced two violations, resolved together:

- **Zone 1 fix** (Twinleaf → Jubilife): cut Sandgem Town as its own stop. Route 201 → Route 202 → Jubilife (2 non-battle segments, was 3).
- **Zone 2 fix** (Gym 2 → Gym 3): merged 9 individual locations into 2 combined segments — **Mt. Coronet Crossing** (Cycling Road + Route 207 + Mt. Coronet + Route 208) and **Hearthome Outskirts** (Hearthome City + Route 209 + Solaceon Town + Route 210 + Route 215).

Everywhere else in the outline already satisfied the rule (runs of 1-2) and is unchanged. Full sequence: Twinleaf Town (starter + Barry) → Route 201 → Route 202 → Jubilife City (Galactic Grunts) → Route 203 → Oreburgh Gate → Oreburgh City (Gym 1: Roark) → Jubilife City (Mars) → Route 204 → Floaroma Town → Valley Windworks (Mars) → Route 205 → Eterna Forest → Eterna City (Gym 2: Gardenia, then Jupiter) → Mt. Coronet Crossing → Hearthome Outskirts → Veilstone City (Gym 3: Maylene) → Route 214 → Route 213 → Pastoria City (Gym 4: Crasher Wake) → Route 210 North → Celestic Town (Grunt) → Hearthome City (Gym 5: Fantina) → Route 218 → Canalave City (Gym 6: Byron) → Lake Valor (Saturn) → Lake Verity (Mars) → Mt. Coronet → Routes 216-217 → Snowpoint City (Gym 7: Candice) → Veilstone City (Saturn, Jupiter, Cyrus) → Mt. Coronet → Spear Pillar (Mars, Jupiter, Cyrus, legendary encounter) → Sunyshore City (Gym 8: Volkner) → Route 223 → Victory Road → Pokemon League (Elite Four: Aaron, Bertha, Flint, Lucian, then Champion Cynthia).

Battle rosters for every trainer are in `game/src/data/trainers.ts`.

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
- Catching: land on a wild encounter, the game rolls a species from the table, then rolls a catch attempt at `catchRate / 255` (clamped 10%-95%) — a simplified stand-in for the real HP/ball-based Gen IV formula, which needs mechanics (HP, Poke Balls) this game doesn't have. Success adds the species to the active team (max 6) or the bench; failure has no penalty (per the user: revisit later if that should change).

**Battles** (`game/src/battle/roulette.ts`, `TeamManagementScene`, `BattleScene`): before every battle, `TeamManagementScene` shows the player's active team and bench alongside the opponent's roster, and lets the player reorder the active lineup or swap in bench Pokemon. `BattleScene` then computes a lead-vs-lead type matchup tier (overwhelming/advantage/neutral/disadvantage/overwhelmed), builds win/lose weights (`1 + total active team power + type bonus + X-Attack bonus` vs. `1 + battle tier weight×2 + type penalty`), shows a win%/lose% bar, and a "Spin" button resolves the outcome. The existing run-ending rule (gym/Elite Four/Champion loss ends the run; everything else has no penalty) still applies on a loss.

## Items

Three consumables (`game/src/data/items.ts`), found via the "look for an item" action (weighted: X-Attack common, Potion less common, Revive rare — rarity matches impact):
- **X-Attack**: used proactively during a non-battle segment (the "heal" action slot was repurposed into "Use X-Attack" since there's no HP system to heal) — queues a win-odds bonus (`pendingBoost`) consumed by the very next battle only, then cleared regardless of outcome.
- **Revive**: used only after losing a run-ending battle (gym/Elite Four/Champion) — retries that exact battle immediately with the same lead Pokemon.
- **Potion**: used only after losing a run-ending battle — retries the battle, but routes through `TeamManagementScene` first with `mustChangeLeadFrom` set, which blocks continuing until the active lead is no longer the Pokemon that just lost.

Shop/currency stays deferred (not built) — items only come from the "find item" action, not purchased.

## Visuals

- **Pokemon sprites**: loaded at runtime from PokeAPI's public sprite CDN (`raw.githubusercontent.com/PokeAPI/sprites`) by National Dex number — the same source zeroxm/pokemon-roulette uses. Pixel-art sprites only, everywhere (starter select, battle, team management) — the official-artwork variant was tried for starter select but dropped per the user's preference for pixel art throughout. See `game/src/data/sprites.ts`.
- **Trainer sprites**: skipped — no equivalent clean free source. Trainers stay text-only.
- **Location themes** (`game/src/data/locationThemes.ts`): each segment gets a dark background color matching its real personality (e.g. Hearthome purple like Fantina, Jubilife beige/silver as the media city, Snowpoint icy blue, Victory Road dramatic red). Not a walkable tile map — still card-based screens, just themed.

## Meta-Progression

None in Phase 1. Every run starts from a blank slate. Persistent unlocks (currency, starter unlocks, permanent upgrades) are explicitly deferred until after the base game exists.

## Future Direction (not built yet)

- Region randomization or player-selectable region.
- Meta-progression systems between runs.
- A full walkable tile-based overworld with a region minimap showing player position (explicitly deferred — to be considered once more of the map/UI exists).

## Open Questions

- Only "lore" is still a pure flavor-text stub in `ActionScene` — catching, X-Attack, and item-finding are all real mechanics now.
- Whether losing a route/rival/commander battle should carry any minor consequence later (currently: none).
- Whether fainted/lost Pokemon should ever leave the team (currently: team composition never shrinks; only run-ending losses matter).
- Region minimap showing player position — deferred, to consider once more of the map/UI exists.
- Shop/currency system — deferred ("keep in mind, not yet"); items currently only come from the "find item" action.
- Overall visual polish — the user noted the game "looks kind of bland" currently (flat card screens, no animation/juice). Not urgent, but flagged for a future pass beyond the sprite/theme work already done.

## Changelog

- 2026-07-07: Initial kickoff session. Established tech stack, IP approach, Phase 1 region (Sinnoh), run structure, loss rules, and deferred meta-progression/repo setup. Scaffolded TypeScript+Phaser+Vite skeleton in `game/`.
- 2026-07-07: Built the full Sinnoh story progression as a playable click-through prototype. Encoded the finalized (post-reduction) segment list and trainer rosters as data, and implemented starter select, overworld, action, battle, game-over, and victory scenes in Phaser. Confirmed starter selection is player-chosen, not random (supersedes the kickoff session's "random starter" note).
- 2026-07-07: Connected the project to a local git repository (no remote).
- 2026-07-07: Replaced the battle Win/Lose stub with a real roulette mechanic (modeled on zeroxm/pokemon-roulette) and made catching real, grounded in Bulbapedia encounter/catch-rate data with documented simplifications. Added `TeamManagementScene` for pre-battle team reordering and bench swaps.
- 2026-07-07: Added real Pokemon sprites (PokeAPI CDN) to starter select, battles, and team management, plus dark per-location background themes matching each city's real personality.
- 2026-07-07: Switched starter select to pixel-art sprites (dropped the official-artwork variant) so sprite style is consistent everywhere.
- 2026-07-07: Added real items — X-Attack (pre-battle win-odds boost), Potion and Revive (retry a lost run-ending battle, with or without a forced lead change). Shop/currency and general visual polish noted as future work, not urgent.
