# GDPR Platformer Game Setup Guide

This document will help you get the GDPR educational platformer game running on your local machine. The game demonstrates the "Right to Be Forgotten" principle through interactive gameplay.

## Prerequisites

Before starting, ensure you have Python installed on your system. This game has been tested with Python 3.8 and above. You'll also need pip, Python's package installer, which usually comes with Python.

## Installation Steps

1. First, create a new directory for your game:
```bash
mkdir gdpr-platformer
cd gdpr-platformer
```

2. It's recommended to create a virtual environment:
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install the required package:
```bash
pip install pygame
```

4. Create a new file called `gdpr_game.py` and paste the game code into it.

5. Run the game:
```bash
python gdpr_game.py
```

## Game Controls

- Left Arrow: Move left
- Right Arrow: Move right
- Spacebar: Jump
- Mouse Click: Use the "Delete My Data" button

## Troubleshooting

If you encounter a "pygame not found" error:
- Make sure your virtual environment is activated
- Try reinstalling pygame: `pip install pygame --upgrade`

If you see display-related errors:
- On Linux, you might need to install additional dependencies:
  ```bash
  sudo apt-get install python3-pygame
  ```
- On macOS, you might need to install the SDL library:
  ```bash
  brew install sdl2
  ```

## File Structure

Your directory should look like this:
```
gdpr-platformer/
├── venv/
└── gdpr_game.py
```

A `player_data.json` file will be automatically created when you play the game.

## Development Notes

The game automatically saves player data to `player_data.json`. This file simulates a real database and demonstrates what data would typically be subject to GDPR deletion requests.

## Additional Resources

If you're interested in learning more about GDPR compliance in game development, check out:
- The official EU GDPR portal
- The International Game Developers Association (IGDA) privacy guidelines
- Your local game development community for region-specific compliance requirements

For any technical issues, please create an issue in the repository or reach out to the development team.
