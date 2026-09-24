# SCT_WD_3
# Tic-Tac-Toe Web Application

A stylish, responsive tic-tac-toe game built with plain HTML, CSS and JavaScript. Play against a friend on the same screen or challenge the computer. It was built for **Task 03 (Alternative)** of the SkillCraft Technology internship.

## Features

- **Two game modes:** Two players on one device, or play against the computer
- **Three difficulty levels:**
  - Easy: the computer plays random moves
  - Medium: the computer takes wins and blocks your winning moves
  - Unbeatable: the computer uses the minimax algorithm and never loses
- **Game state tracking:** the board, current turn and round result are tracked automatically
- **Win and draw detection:** checks all 8 winning lines (3 rows, 3 columns, 2 diagonals)
- **Scoreboard:** tracks wins for each player and draws, and highlights whose turn it is
- **Fair starts:** the starting player alternates every round
- **Animated marks:** X and O are drawn on the board, and a line sweeps across the winning row
- **Responsive design:** works on phones, tablets and desktops
- **Accessible:** keyboard navigation, visible focus outlines, screen reader labels, and reduced-motion support

## Project Structure

```
tic-tac-toe/
├── index.html   # Page structure
├── style.css    # Styling, layout and animations
└── script.js    # Game logic and computer player
```

## How to Run

1. Download or clone the project folder.
2. Keep `index.html`, `style.css` and `script.js` in the same folder.
3. Open `index.html` in any modern web browser.

No installation or build step is needed.

## How to Play

1. Choose an opponent: **Two players** or **Vs computer**.
2. If you chose the computer, pick a difficulty level.
3. Click any empty square to place your mark. X always goes first in the first round.
4. Get three marks in a row (horizontal, vertical or diagonal) to win.
5. Click **New round** to play again, or **Reset scores** to start over.

Changing the opponent or difficulty resets the scores.

## How It Works

- **Game state:** a single `state` object holds the board, current player, scores and mode.
- **Winner check:** the `evaluate()` function tests the board against the 8 winning combinations and detects draws.
- **Computer player:** Easy picks a random empty square. Medium looks for a winning move, then a blocking move, then the centre. Unbeatable runs minimax with alpha-beta pruning to find the best possible move.
- **Rendering:** the board is built with JavaScript, and X and O are inline SVG drawings animated with CSS.

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, custom properties, animations)
- Vanilla JavaScript (ES6)
- Google Fonts (Bricolage Grotesque)

##Demo link
https://gaurikhamankar123-star.github.io/SCT_WD_3/
