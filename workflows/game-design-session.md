# Workflow: Game Design / Dev Session

Recipe for continuing work on the Pokemon fan game in future sessions.

1. **Recap** — Read `design/game-design-document.md` in full. Summarize current state back to the user in a few bullets before diving in.
2. **Ask what's next** — Ask the user what to focus on this session: a mechanic, the region/map, battle system, UI, art direction, meta-progression, etc. Don't assume.
3. **Clarify before proposing** — Ask specific questions to pin down rules and edge cases before writing any design text or code. Prefer concrete either/or questions over open-ended ones.
4. **Update the GDD** — Write settled decisions into the relevant section of `design/game-design-document.md`. Remove or resolve the matching item in Open Questions if one existed.
5. **Build if ready** — If a discussed feature is concrete enough to implement, scaffold or extend the code in `game/`. If it's still a decision, not an implementation, stop at the doc update.
6. **Log the session** — Add a dated entry to the GDD's Changelog summarizing what was decided and what was built.
7. **Repo check** — Once there's a working base worth versioning, ask the user if they want to connect this project to a git repository. Don't do it proactively.
