import random
import time
import math

class MothmanWhisper:
    def __init__(self):
        self.canvas_width = 80
        self.canvas_height = 40
        self.canvas = [[' ' for _ in range(self.canvas_width)] for _ in range(self.canvas_height)]
        self.symbols = ['🦋', '👁️', '📚', '🔥', '🌙', '🕯️', '🦇', '🕸️', '🗝️', '⏳']

    def clear_canvas(self):
        """Reset the canvas to empty space."""
        self.canvas = [[' ' for _ in range(self.canvas_width)] for _ in range(self.canvas_height)]

    def draw_mothman(self, x, y):
        """
        Draw a simple ASCII representation of Mothman.
        
        This function places a stylized Mothman figure on our canvas. The Mothman
        is represented by a combination of characters that suggest a winged figure
        with large, prominent eyes.
        """
        mothman = [
            "  ^   ^  ",
            " ( o o ) ",
            "  \\ = /  ",
            " /`---`\\ ",
            "/       \\",
        ]
        for i, row in enumerate(mothman):
            for j, char in enumerate(row):
                if 0 <= y+i < self.canvas_height and 0 <= x+j < self.canvas_width:
                    self.canvas[y+i][x+j] = char

    def draw_burning_library(self):
        """
        Draw a representation of a burning library.
        
        This method creates an abstract depiction of the burning library mentioned
        in the Archive of Lost Things story. It uses ASCII characters to suggest
        flames and book shapes.
        """
        for i in range(self.canvas_height-10, self.canvas_height):
            for j in range(self.canvas_width):
                if random.random() < 0.7:
                    self.canvas[i][j] = random.choice(['=', '|', '/', '\\'])  # Books
                elif random.random() < 0.3:
                    self.canvas[i][j] = random.choice(['*', '^', '~'])  # Flames

    def draw_archive_box(self, x, y):
        """
        Draw a representation of the archive box.
        
        This function creates a simple box shape to represent the archive box
        from the story, which holds the weight of forgotten histories.
        """
        box = [
            "+-----+",
            "|     |",
            "|     |",
            "+-----+"
        ]
        for i, row in enumerate(box):
            for j, char in enumerate(row):
                if 0 <= y+i < self.canvas_height and 0 <= x+j < self.canvas_width:
                    self.canvas[y+i][x+j] = char

    def add_mystical_symbols(self):
        """
        Add mystical symbols throughout the canvas.
        
        This method sprinkles various symbolic emojis across the canvas,
        adding to the mystical and otherworldly atmosphere of the scene.
        """
        for _ in range(50):  # Add 50 random symbols
            x = random.randint(0, self.canvas_width-1)
            y = random.randint(0, self.canvas_height-1)
            self.canvas[y][x] = random.choice(self.symbols)

    def add_whispers(self):
        """
        Add whispered text to the canvas.
        
        This function adds fragments of text across the canvas, representing
        the whispers and forgotten stories from the Archive of Lost Things.
        """
        whispers = [
            "forgotten truths",
            "lost memories",
            "hidden histories",
            "untold stories",
            "ancient secrets"
        ]
        for _ in range(5):  # Add 5 whispers
            whisper = random.choice(whispers)
            x = random.randint(0, self.canvas_width - len(whisper))
            y = random.randint(0, self.canvas_height - 1)
            for i, char in enumerate(whisper):
                self.canvas[y][x+i] = char

    def generate_scene(self):
        """
        Generate a complete scene combining all elements.
        
        This method orchestrates the creation of our ASCII art scene,
        calling various drawing methods in a specific order to build
        up the final image.
        """
        self.clear_canvas()
        self.draw_burning_library()
        self.draw_mothman(35, 5)
        self.draw_archive_box(10, 20)
        self.add_mystical_symbols()
        self.add_whispers()

    def display_canvas(self):
        """
        Display the current state of the canvas.
        
        This function prints out our 2D canvas as a cohesive ASCII art image.
        """
        for row in self.canvas:
            print(''.join(row))

    def animate_scene(self, frames=5, delay=1):
        """
        Create a simple animation of the scene.
        
        This method generates multiple frames of our scene with slight
        variations, creating a simple animation effect when displayed
        in sequence.
        """
        for _ in range(frames):
            self.generate_scene()
            self.display_canvas()
            time.sleep(delay)
            print("\033[H\033[J", end="")  # Clear console (ANSI escape code)

if __name__ == "__main__":
    print("Welcome to the Mothman's Whisper ASCII Art Generator")
    print("This program will create a series of ASCII art scenes")
    print("inspired by the Archive of Lost Things and Mothman mythology.")
    print("Each scene represents a moment frozen in time, where the")
    print("weight of forgotten histories meets the enigmatic presence")
    print("of the Mothman. Watch as the scenes unfold before you...")
    print("\nPress Enter to begin the animation...")
    input()

    art_generator = MothmanWhisper()
    art_generator.animate_scene()

    print("\nThe whispers fade, but the memories linger...")
    print("Thank you for experiencing the Mothman's Whisper.")

# Note: This script uses emoji characters which may not display correctly
# in all console environments. If you encounter display issues, you can
# replace the emojis in the 'symbols' list with ASCII characters.

# To run this script, simply execute it in a Python environment:
# python mothman_whisper.py

# The script will generate a series of ASCII art scenes, each displaying
# for a brief moment before transitioning to the next. The scenes combine
# elements from the Mothman mythology and the Archive of Lost Things story,
# creating a surreal and mystical atmosphere.

# Feel free to modify the canvas size, symbols, or drawing methods to
# create your own unique variations of this ASCII art generator.
