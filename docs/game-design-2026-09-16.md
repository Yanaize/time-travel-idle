# Time Travel Idle --- Game Design Snapshot

> Cursor-facing snapshot of **Phase 1 - The Time Machine**\
> Snapshot date: 2026-09-16\
> Treat specified mechanics as source of truth. **TBD**/blank content is
> unfinished and must not be invented.

# Phase 1 --- The Time Machine

## Prologue

You're an insanely dumb person in the future, who is bored and wants to
build a time machine. So you start studying.

## Stage 1 --- Start → Mathematics Subject

### Studying

-   Base Studying time: **3 seconds**
-   Base reward: **1 Knowledge**
-   Base failure chance: **20%**
-   Only the **next 5 upgrades** are revealed at a time.

### Knowledge Upgrades #1--#10

  \#   Upgrade                    Price Effect
  ---- ------------------------ ------- -------------------------------------------
  1    Take Notes                     5 +1 Knowledge per Study
  2    Improved Studying              7 -0.1s Studying time
  3    Better Sources                10 ×1.5 Knowledge per Study
  4    Critical Studying             15 5% chance to earn double Knowledge
  5    Even Better Studying          15 Divide Studying time by 1.2
  6    Organized Notes               20 +1 Knowledge per Study
  7    Tough Paper                   22 -5 percentage points Study failure chance
  8    Verified Sources              25 ×1.5 Knowledge per Study
  9    Very Improved Studying        27 -0.1s Studying time
  10   **The Library**               30 Unlock **The Library**

## The Library

-   Spend Knowledge to purchase books.
-   Page counts are 10, 20, 30, 40, or 50.
-   Reading can happen alongside Studying.
-   Base Reading time: **10 seconds/page**.
-   Certain books may have Reading-time multipliers.
-   Every page grants its book's stat bonus.
-   Completing a book grants its completion bonus.

### Books #1--#6

  --------------------------------------------------------------------------------------
  \#         Book                  Pages          Price Per-page bonus    Completion
                                                                          bonus
  ---------- ------------ -------------- -------------- ----------------- --------------
  1          The                      30             50 -0.02s Studying   **TBD**
             Objective                                  Time/page (-0.6s  
             Studying                                   total)            
             Method                                                       

  2          Critical                 40            100 +5% Critical      +5 percentage
             Thinking                                   Studying          points
                                                        Multiplier/page   Critical
                                                        (+200% total)     Studying
                                                                          Chance

  3          Practice                 30            250 -0.01s Reading    Unlock
             Makes                                      Time/page (-0.3s  **Repeatable
             Perfect                                    total)            Upgrades**

  4          The Art of               30            750 **TBD**           **TBD**
             Reading                                                      
             Books                                                        

  5          Knowledge                50          1,500 +0.2 Knowledge    +5 Knowledge
             101                                        per Study/page    per Study
                                                        (+10 total)       

  6          What is                  20          5,000 Streaks gain an   All-time best
             Streaking?                                 additional +0.5%  streak
                                                        Knowledge         increases
                                                        multiplier per    Knowledge
                                                        successful Study  multiplier
                                                        per page          outside
                                                                          streaks by 1%
                                                                          per Study
  --------------------------------------------------------------------------------------

### Knowledge Upgrades #11--#25

  ------------------------------------------------------------------------
  \#               Upgrade                          Price Effect
  ---------------- ---------------- --------------------- ----------------
  11               Improved Reading                    40 -0.2s Reading
                                                          time

  12               Proven Sources                      45 ×2 Knowledge per
                                                          Study

  13               Super Studying                      60 -0.3s Studying
                                                          time

  14               Even Better                         80 -0.5s Reading
                   Reading                                time

  15               Knowledgeable                      120 ×1.5 Knowledge
                                                          per Study

  16               I'm not a                          350 -5 percentage
                   failure!                               points Study
                                                          failure chance

  17               Critical Reader                    500 Reading has 5%
                                                          chance to
                                                          complete an
                                                          additional page

  18               **Streaks**                      1,000 Unlock Streaks;
                                                          consecutive
                                                          successful
                                                          Studies increase
                                                          Knowledge
                                                          multiplier by 5%
                                                          per Study after
                                                          5 consecutive
                                                          Studies

  19               **TBD**                          1,200 **TBD**

  20               **TBD**                        **TBD** **TBD**

  21               **TBD**                        **TBD** **TBD**

  22               **TBD**                        **TBD** **TBD**

  23               **TBD**                        **TBD** **TBD**

  24               **TBD**                        **TBD** **TBD**

  25               **TBD**                         10,000 **TBD**
  ------------------------------------------------------------------------

### Repeatable Knowledge Upgrades #1--#3

Unlocked by completing **Practice Makes Perfect**.

  -----------------------------------------------------------------------
  \#                Upgrade           Price notation    Effect
  ----------------- ----------------- ----------------- -----------------
  1                 Knowledge         `50*2.5`          +25% Knowledge
                    Multiplier                          gain per purchase

  2                 Reading Enhancer  `150*3`           -0.25s Reading
                                                        Time per purchase

  3                 Critical Learner  `150*3`           +10% Critical
                                                        Studying
                                                        Multiplier per
                                                        purchase
  -----------------------------------------------------------------------

> Confirm the exact meaning of the price-scaling notation before
> implementation if not defined elsewhere.

### Streaks

-   Unlocked by Knowledge Upgrade #18.
-   Consecutive successful Studies build a streak.
-   After 5 consecutive successful Studies, Streaks increase Knowledge
    multiplier.
-   Base effect: +5% Knowledge multiplier per successful Study after the
    threshold.
-   Book #6 modifies Streaks and its completion bonus uses the all-time
    best streak.
-   Unspecified reset behavior, formula ordering, caps, and edge cases
    remain **TBD**.

### Research Table

**TBD.**

## Stage 2 --- Mathematics Subject → ???

**TBD.**

# Implementation Boundaries for Cursor

1.  Implement explicitly specified mechanics and values as written.
2.  Do not invent TBD, blank, or unspecified gameplay.
3.  Do not fill unfinished Knowledge Upgrades #19--#25 or unfinished
    book effects.
4.  Do not invent Research Table or Mathematics/Subject mechanics.
5.  Future mechanics may influence architecture, but should not be
    implemented until designed and requested.
6.  If an unspecified rule is required, ask a clearly labeled **GAME
    DESIGN QUESTION**.

## Known Design Questions

-   Completion bonus for The Objective Studying Method?
-   Effects for The Art of Reading Books?
-   Can only one book/page be read at a time?
-   Are books purchased in a fixed order?
-   Exact "next 5 upgrades" reveal behavior?
-   Does failed Studying always award 0 Knowledge?
-   Does Critical Studying roll only after success?
-   Exact additive/multiplicative modifier order?
-   Are completion bonuses hidden until completion?
-   Does `50*2.5` mean price ×2.5 after each purchase?
-   Do Repeatable Upgrades have caps?
-   Critical Reader behavior when only one page remains?
-   Does Streak bonus begin on Study #5 or #6?
-   What resets/caps a Streak?
-   How does Book #6 combine with the base Streak bonus?
-   Exact all-time-best-streak bonus calculation?
-   What does Research Table do?
-   What unlocks Mathematics?
