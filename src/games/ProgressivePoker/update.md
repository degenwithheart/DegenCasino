Here’s the comprehensive prompt that describes your Mines-style Progressive Power Poker concept, the live-echo system, and all functional requirements.

Prompt: Mines-Style Progressive Power Poker with Live Hand Echo
Goal:
Create a per-card progressive poker game inspired by the game flow of Mines, where the player flips cards one at a time, deciding at each step whether to Continue (risking their current winnings) or Cash Out (locking in payout).
The game must live-echo current and potential poker hand states after every card reveal.

Game Flow Requirements
Start Phase:

Player places an initial wager.

Deal 5 random cards face-down from a standard 52-card deck.

Reveal the first card automatically.

Per-Card Reveal Flow:
After each revealed card:

Update the revealed cards array.

Evaluate the current hand:

Determine the best hand achievable with only the revealed cards so far (e.g., "Pair of 8s", "High Card Ace").

Evaluate the best possible final hand given the remaining cards in the deck and the number of unrevealed slots:

Example: "1 card away from Full House", "Straight still possible", "Flush draw".

Detect Bust Condition:

Bust occurs if no possible winning combination can be formed with the remaining unrevealed cards.

If bust, display "Bust — no winning hand possible" and end the round.

Live Echo Output:

Show two lines in the UI:

Current Hand: Best hand right now.

Best Possible: Strongest finish still achievable or bust message.

Example:

sql
Copy
Edit
Current Hand: Pair of 8s
Best Possible: 1 card away from Full House
Decision Point:

If not bust and not fully revealed:

Show two buttons: Continue and Cash Out.

Continue: Reveal next card and repeat the process.

Cash Out: End round and pay according to current hand multiplier.

If fully revealed (5 cards), auto-end round and pay final hand multiplier.

Multiplier Progression:

Each card reveal increases the potential payout multiplier based on:

The strength of the current hand.

The reduced number of cards left (increased risk).

Use a predefined multiplier table for each hand type and stage count.

Hand Evaluation Logic Requirements
getCurrentHandName(revealedCards)

Takes revealed cards and returns a human-readable poker hand name:

"High Card X", "Pair of Xs", "Two Pair", "Three of a Kind", "Straight", "Flush", "Full House", "Four of a Kind", "Straight Flush", "Royal Flush".

getBestPossibleHandName(revealedCards, cardsLeftInDeck, slotsRemaining)

Simulates all possible completions of the current partial hand with remaining deck cards.

Finds the highest-ranking achievable hand.

If the highest possible hand is not yet made:

If only 1 card could complete it → "1 card away from X".

If more cards could complete it → "X still possible".

If no possible paying hand exists → "Bust".

isBust(revealedCards, cardsLeftInDeck, slotsRemaining)

Returns true if no paying hand can be made given the current state.

UI/UX Requirements
Live Echo Display:
A visible panel or overlay showing:

csharp
Copy
Edit
Current Hand: [string from getCurrentHandName]
Best Possible: [string from getBestPossibleHandName or "Bust"]
Decision Buttons:
Appear only after echo update and before next reveal:

Continue (reveals next card)

Cash Out (ends round and pays out)

Bust Handling:
If bust detected:

Show “Bust — No possible winning hand” message.

Play bust animation.

End round immediately.

Example Gameplay Log
pgsql
Copy
Edit
[Start Round] Wager: $5
Flip Card 1: 8♠
Current Hand: High Card 8
Best Possible: Royal Flush still possible

Flip Card 2: 8♦
Current Hand: Pair of 8s
Best Possible: 3 cards away from Full House
[Continue / Cash Out]

Flip Card 3: K♠
Current Hand: Pair of 8s
Best Possible: 2 cards away from Full House
[Continue / Cash Out]

Flip Card 4: K♥
Current Hand: Two Pair (8s and Kings)
Best Possible: 1 card away from Full House
[Continue / Cash Out]

Flip Card 5: 8♥
Current Hand: Full House (8s over Kings)
Best Possible: Full House Final
[Payout x9.0]
Technical Notes
Use a standard poker hand ranking system for evaluation.

Calculations must be efficient enough for live updates after each card flip.

Logic should be modular:

Game Engine: deals, tracks state, handles payouts.

Hand Evaluator: current + potential.

UI Controller: renders state, buttons, and animations.