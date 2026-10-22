# Verse data audit

All 701 verses were audited before publication. This note records what was checked, what was found, and what is still only machine-checked.

## What was checked and what changed

| Check | Method | Result |
|---|---|---|
| Verse structure | Counted verses per chapter against the standard 18-chapter layout (47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78 = 701) | All 18 chapters match; no gaps, duplicates or empty fields |
| Sanskrit text | Compared every verse with an independent public edition | 696 of 701 match. The other 5 (1.20, 1.21, 1.28, 1.44, 2.64) are standard textual variants or differences in how verses are split |
| English translations | Each of the 701 was audited by a scholar-grade model against the Sanskrit and four reference translations | 321 were flagged (46%) for changed meaning, omissions or additions, e.g. 6.5, 9.16, 11.55, 7.11. Two (1.7, 16.6) were placeholder text and 2.48 began with an editing note. All 321 were regenerated and re-audited until they passed |
| Word-by-word meanings | Checked against each verse's own Sanskrit | In 23 verses the source list carried the neighbouring verse's words (e.g. 12.3 included 12.4; 1.5 included half of 1.6). Verse 11.19 had no meanings at all. Each was rebuilt from its own Sanskrit and re-audited |
| Hindi and Telugu | Prepared from the Sanskrit, the verified English and standard Hindi references, then each of the 701 in both languages audited by a native-speaker-level model | Hindi: 21 flagged (3%). Telugu: 108 flagged (15%), including a reversed meaning in 7.12. Every flagged verse was regenerated and passed a second audit |

## Limits

- The audits were performed by AI, not by human scholars. They are strong at catching changed or missing meaning, but they are not a replacement for review by a teacher.
- The Hindi and Telugu translations are AI-prepared. The site says so wherever they are shown.
- Krishna's conversational replies and the "Teach me this shloka" lessons are generated live. They are grounded in the verse text but are not individually audited. Lessons tell Mahabharata episodes from memory and are instructed to use only well-known events.

Corrections are welcome at hello@jmadhan.me.
