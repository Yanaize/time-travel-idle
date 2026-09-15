# Time Travel Idle --- Game Design Snapshot

> **Cursor-facing design snapshot**
>
> Source: Notion page **"Phase 1 - The Time Machine"**
>
> Snapshot date: 2026-09-15
>
> This file describes the gameplay that is currently designed. Treat
> specified values and mechanics as the source of truth. Anything marked
> **TBD**, **???**, or left blank is intentionally unfinished and must
> not be invented without asking the game designer.

# Phase 1 --- The Time Machine

## Prologue

You're an insanely dumb person in the future, who is bored and wants to
build a time machine. So you start learning.

------------------------------------------------------------------------

## Stage 1 --- Start → Subjects

### Learning

The player can click the **Learn** button to study.

-   Base learning time: **3 seconds**
-   Base reward: **1 Knowledge**
-   Base failure chance: **20%**
-   On a failed learning attempt, the player does not successfully
    learn.
-   Only the **next 5 upgrades** are revealed at a time.

### Knowledge Upgrades #1--#10

  ------------------------------------------------------------------------
  \#               Upgrade              Price (Knowledge) Effect
  ---------------- ---------------- --------------------- ----------------
  1                Take Notes                           5 Earn +1
                                                          Knowledge per
                                                          study.

  2                Improved                             7 Decrease
                   Learning                               learning time by
                                                          0.1s.

  3                Better Sources                      10 ×1.5 Knowledge
                                                          per study.

  4                Critical                            15 Learning now has
                   Learning                               a 5% chance to
                                                          earn double
                                                          Knowledge.

  5                Even Better                         15 Divide learning
                   Learning                               time by 1.2.

  6                Organized Notes                     20 Earn +1
                                                          Knowledge per
                                                          study.

  7                Tough Paper                         22 Reduce the
                                                          chance of
                                                          failing Learning
                                                          by 5 percentage
                                                          points.

  8                Verified Sources                    25 ×1.5 Knowledge
                                                          per study.

  9                Very Improved                       27 Decrease
                   Learning                               learning time by
                                                          0.1s.

  10               **The Library**                     30 Unlock **The
                                                          Library**.
  ------------------------------------------------------------------------

------------------------------------------------------------------------

## The Library

The Library introduces **Books**.

### Core Book Mechanic

-   Books are purchased by spending **Knowledge**.
-   Every book has a page count.
-   Intended page-count sizes are **10, 20, 30, 40, or 50 pages**.
-   The player can read a page from a book **alongside Learning**.
-   Reading each page gives a permanent/statistical bonus specific to
    that book.
-   Finishing an entire book grants a **completion bonus** specific to
    that book.

### Books #1--#12

Only currently designed information is listed below. Missing values are
intentionally unfinished.

  -------------------------------------------------------------------------------
  \#         Book                  Pages          Price Per-Page     Completion
                                            (Knowledge) Stat         Bonus
                                                        Increase     
  ---------- ------------ -------------- -------------- ------------ ------------
  1          "The                     20             30 Decrease     **???**
             Objective                                  Learning     
             Learning                                   Time by      
             Method"                                    0.03s per    
                                                        page (0.6s   
                                                        total).      

  2          "Critical                40             50 Increase     Increase
             Thinking"                                  Critical     Critical
                                                        Learning     Learning
                                                        multiplier   chance by
                                                        by 5% per    5%.
                                                        page (200%   
                                                        total).      

  3          **TBD**             **TBD**        **TBD** **TBD**      **TBD**

  4          **TBD**             **TBD**        **TBD** **TBD**      **TBD**

  5          **TBD**             **TBD**        **TBD** **TBD**      **TBD**

  6          "Economics          **TBD**        **TBD** **TBD**      Unlock **The
             101"                                                    Wallet**.

  7          **TBD**             **TBD**        **TBD** **TBD**      **TBD**

  8          **TBD**             **TBD**        **TBD** **TBD**      **TBD**

  9          **TBD**             **TBD**        **TBD** **TBD**      **TBD**

  10         **TBD**             **TBD**        **TBD** **TBD**      **TBD**

  11         **TBD**             **TBD**        **TBD** **TBD**      **TBD**

  12         **TBD**             **TBD**        **TBD** **TBD**      **TBD**
  -------------------------------------------------------------------------------

### Knowledge Upgrades #11--#20

**TBD.**

The Notion design currently reserves ten additional Knowledge upgrades
here, but their names, prices, and effects have not been designed yet.

### Research Table

**TBD.**

A Research Table is planned after/within the Library portion of Stage 1,
but its mechanics are not currently specified.

------------------------------------------------------------------------

## Stage 2 --- Mathematics Subject → ???

**TBD.**

Mathematics is currently shown as the beginning of Stage 2, but its
mechanics and the progression after it have not yet been designed in
this snapshot.

------------------------------------------------------------------------

# Implementation Boundaries for Cursor

This section exists to prevent unfinished design notes from accidentally
becoming invented gameplay.

## Source-of-truth rules

1.  Implement explicitly specified mechanics and values as written.
2.  Do **not** invent values for `TBD`, `???`, or blank entries.
3.  Do **not** design Books #3--#12 on your own.
4.  Do **not** invent Knowledge Upgrades #11--#20.
5.  Do **not** invent Research Table mechanics.
6.  Do **not** invent Mathematics/Subject mechanics.
7.  Do **not** implement The Wallet solely because it is mentioned as a
    future unlock.
8.  When implementation requires a rule that is not specified here, ask
    the user a **GAME DESIGN** question rather than silently choosing an
    answer.
9.  Future mechanics may be considered when choosing clean architecture,
    but should not be implemented before they are designed and
    requested.

## Known design questions / ambiguities

These should be resolved with the game designer if they become necessary
for implementation:

-   What is the completion bonus for **The Objective Learning Method**?
-   How long does reading one book page take?
-   Can the player choose any purchased unfinished book to read, and can
    only one page-reading action run at a time?
-   Exactly how does the "next 5 upgrades" reveal system advance as
    upgrades are purchased?
-   What is the precise order of operations for additive and
    multiplicative Knowledge bonuses?
-   Does a failed Learning attempt always award 0 Knowledge?
-   Does Critical Learning roll only after a Learning attempt succeeds?
-   How should Critical Learning's multiplier increases from **Critical
    Thinking** be represented mathematically?
-   Are book completion bonuses hidden from the player until the book is
    completed, or merely locked?
-   What happens when **The Wallet** is unlocked?
-   What does the **Research Table** do?
-   What conditions end Stage 1 and unlock the Mathematics Subject?

Do not resolve these questions by assumption unless the user explicitly
authorizes technical discretion for that specific rule.
