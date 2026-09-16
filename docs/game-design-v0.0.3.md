# Time Travel Idle --- v0.0.3 Game Design Snapshot

## Version Goal

**v0.0.3 = Stage 1 feature-complete through the Mathematics unlock.**

Implement the current Stage 1 design first. Prices, multipliers, timers,
and pacing are provisional and will be balanced through fresh-save
playtesting before Stage 2.

## Premise

You are an insanely dumb person in the future who is bored and wants to
build a time machine. So you start studying.

# Stage 1 --- Start → Mathematics

## Studying

-   Study takes 3 seconds by default.
-   Base reward: 1 Knowledge.
-   Base failure chance: 20%.
-   Only the next 5 Knowledge upgrades are revealed at a time.

## Knowledge Upgrades #1--#21

  ------------------------------------------------------------------------
  \#               Name                             Price Effect
  ---------------- ---------------- --------------------- ----------------
  1                Take Notes                           5 +1 Knowledge per
                                                          Study

  2                Improved                             7 -0.1s Study time
                   Studying                               

  3                Better Sources                      10 ×1.5 Knowledge
                                                          per Study

  4                Critical                            15 5% chance to
                   Studying                               earn double
                                                          Knowledge

  5                Even Better                         15 Divide Study
                   Studying                               time by 1.2

  6                Organized Notes                     20 +1 Knowledge per
                                                          Study

  7                Tough Paper                         22 -5 percentage
                                                          points failure
                                                          chance

  8                Verified Sources                    25 ×1.5 Knowledge
                                                          per Study

  9                Very Improved                       27 -0.1s Study time
                   Studying                               

  10               The Library                         30 Unlock Library

  11               Improved Reading                    40 -0.2s Reading
                                                          time

  12               Proven Sources                      45 ×2 Knowledge per
                                                          Study

  13               Super Studying                      60 -0.3s Study time

  14               Even Better                         80 -0.5s Reading
                   Reading                                time

  15               Knowledgeable                      120 ×1.5 Knowledge
                                                          per Study

  16               Repeatable                         250 Unlock
                   Upgrades                               Repeatable
                                                          Upgrades

  17               I'm not a                          350 -5 percentage
                   failure!                               points failure
                                                          chance

  18               Critical Reader                    500 5% chance for
                                                          Reading to
                                                          complete an
                                                          additional page

  19               Streaks                          1,000 Unlock Streaks

  20               Sturdier                         1,200 -0.1s Study time
                   Studying                               

  21               Research                         1,500 Unlock Research
  ------------------------------------------------------------------------

## Library

The Library is a separate top-level tab. Reading can happen alongside
Studying.

-   Base Reading time: 10 seconds/page.
-   Books contain 10--100 pages.
-   Every page permanently grants that book's page bonus.
-   Finishing a book grants a completion bonus.

### Books #1--#6

  ----------------------------------------------------------------------------------------------
  \#         Book                  Pages          Price Page Bonus             Completion
  ---------- ------------ -------------- -------------- ---------------------- -----------------
  1          The                      50             50 -0.01s Study time/page TBD
             Objective                                                         
             Studying                                                          
             Method                                                            

  2          Critical                 70            100 +3% Critical Study     +5% Critical
             Thinking                                   multiplier/page        Study chance

  3          Practice                 60            250 Use latest finalized   Unlock Repeatable
             Makes                                      Notion value;          Upgrades
             Perfect                                    otherwise TBD          

  4          The Art of               30            750 Use latest finalized   Book page stat
             Reading                                    Notion value;          bonuses are 10%
             Books                                      otherwise TBD          stronger

  5          Knowledge                50          1,500 +0.2                   +5
             101                                        Knowledge/Study/page   Knowledge/Study

  6          What is                  60          5,000 +0.2% additional       All-time best
             Streaking?                                 Streak Knowledge       Streak increases
                                                        multiplier per         Knowledge
                                                        successful Study/page  multiplier
                                                                               outside Streaks
                                                                               by 1% per Study
  ----------------------------------------------------------------------------------------------

## Repeatables #1--#3

  ---------------------------------------------------------------------------
  \#                Name              Price Scaling     Effect
  ----------------- ----------------- ----------------- ---------------------
  1                 Knowledge         150 × 3           +25% Knowledge
                    Multiplier                          gain/purchase

  2                 Reading Enhancer  50 × 2            -0.25s Reading
                                                        time/purchase

  3                 Critical Learner  150 × 3           +10% Critical Study
                                                        multiplier/purchase
  ---------------------------------------------------------------------------

## Streaks

-   Unlocked at Knowledge Upgrade #19.
-   Consecutive successful Studies build a Streak.
-   Initially bonuses start after 5 successful Studies.
-   Each qualifying successful Study adds 5% to the Knowledge
    multiplier.

# Research

Research is the main latter-Stage-1 progression system. - Costs
Knowledge. - Displayed as a linear tree. - Only current and next
Research are revealed. - Research has its own tab.

  \#   Research                   Price Reward
  ---- ---------------------- --------- -----------------------------------
  1    Knowledgeable              1,500 Unlock Knowledge #22--#26
  2    Repeat it Twice More       2,000 Unlock Repeatables #4--#5
  3    Even More Books!           5,000 Unlock Books #7--#10
  4    Mega Brain                15,000 Unlock Knowledge #27--#30
  5    Mathematics              150,000 Unlock first Subject: Mathematics

## Knowledge Upgrades #22--#30

  ------------------------------------------------------------------------
  \#               Name                             Price Effect
  ---------------- ---------------- --------------------- ----------------
  22               Super Reader                     2,000 -1s Reading time

  23               More, More,                      3,000 ×1.5 Knowledge
                   More!                                  gain

  24               Book Pinning                     5,000 Pin books to
                                                          Study tab

  25               Consistency is                   7,500 Streak bonus
                   Key                                    begins after 4
                                                          successful
                                                          Studies

  26               Double Reading                  10,000 Read 2 books
                                                          simultaneously

  27               Critical                        15,000 Critical Studies
                   Streaker                               increase Streak
                                                          by +2

  28               Even Faster                     25,000 Studying and
                                                          Reading 10%
                                                          faster

  29               Efficient                       50,000 Research costs
                   Research                               20% less
                                                          Knowledge

  30               Reading is                      75,000 ×1.5 Knowledge
                   Healthy                                multiplier per
                                                          completed Book
  ------------------------------------------------------------------------

## Repeatables #4--#5

Use the final values in Notion. Do not invent mechanics for anything
still marked TBD.

## Books #7--#10

### #7 --- Pages Are More Powerful Than You Think

-   50 pages
-   15,000 Knowledge
-   Every page read contributes a small Knowledge multiplier (currently
    0.002% as specified).
-   Completion bonus: use finalized Notion value; otherwise TBD.

### #8 --- 100 Reasons Why You Shouldn't Bother

-   100 pages
-   20,000 Knowledge
-   +0.1% Knowledge per Study per page.
-   Completion: +5% Knowledge per Study.

### #9

Use the finalized Notion design. If the old duplicate Practice Makes
Perfect placeholder remains, flag it instead of implementing the
duplicate.

### #10

Final pre-Mathematics book. - Use finalized Notion
title/pages/price/page bonus. - Completion bonus is
Mathematics-related. - If its Stage 2 effect is still TBD, preserve it
as TBD rather than inventing Mathematics mechanics.

# Navigation Architecture

Use top-level tabs:

Start: `[ STUDY ]`

After Library: `[ STUDY ] [ LIBRARY ]`

After Research: `[ STUDY ] [ LIBRARY ] [ RESEARCH ]`

Later: `[ STUDY ] [ LIBRARY ] [ RESEARCH ] [ SUBJECTS ]`

Requirements: - Knowledge remains globally visible. - Locked tabs do not
appear. - Study, Library, and Research are separate page/components. -
Keep navigation/presentation separated from gameplay logic. - Keep it
simple; do not overengineer. - No thematic visual redesign yet.

# v0.0.3 Balancing Pass

After implementation: 1. Start a completely fresh save. 2. Play Stage 1
normally. 3. Record milestone times. 4. Identify dead periods, sudden
spikes, useless upgrades, overpowered interactions, and tedious grinds.
5. Adjust prices, multipliers, timers, probabilities, page counts, and
requirements. 6. Repeat fresh-save playtests. 7. Do not begin Stage 2
until reaching Mathematics feels complete and fun.

The late Stage 1 should increasingly encourage optimization of Books,
Repeatables, Streaks, Knowledge Upgrades, and Research to reach the
150,000-Knowledge Mathematics breakthrough.

# Cursor Implementation Rules

-   Treat this snapshot as the v0.0.3 gameplay source of truth.
-   Inspect the existing codebase before changing architecture.
-   Preserve save compatibility where reasonably possible.
-   Never silently invent TBD values.
-   Do not add unrequested mechanics.
-   Do not redesign the visual theme.
-   Keep balancing values easy to edit.
-   Prefer data-driven definitions for upgrades, books, and Research
    where practical.
