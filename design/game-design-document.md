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

## Meta-Progression

None in Phase 1. Every run starts from a blank slate. Persistent unlocks (currency, starter unlocks, permanent upgrades) are explicitly deferred until after the base game exists.

## Future Direction (not built yet)

- Region randomization or player-selectable region.
- Meta-progression systems between runs.

## Open Questions

- Sprite/tile art source: custom pixel art vs. placeholder vs. other. Not blocking the current skeleton.
- Battle system depth: how close to mainline turn-based mechanics (stats, types, moves) should Phase 1 go? Currently a Win/Lose stub in `BattleScene`.
- Catch/shop/item systems are currently flavor-text stubs in `ActionScene` — real mechanics not designed yet.
- Whether losing a route/rival/commander battle should carry any minor consequence later (currently: none).

## Changelog

- 2026-07-07: Initial kickoff session. Established tech stack, IP approach, Phase 1 region (Sinnoh), run structure, loss rules, and deferred meta-progression/repo setup. Scaffolded TypeScript+Phaser+Vite skeleton in `game/`.
- 2026-07-07: Built the full Sinnoh story progression as a playable click-through prototype. Encoded the finalized (post-reduction) segment list and trainer rosters as data, and implemented starter select, overworld, action, battle, game-over, and victory scenes in Phaser. Confirmed starter selection is player-chosen, not random (supersedes the kickoff session's "random starter" note).
