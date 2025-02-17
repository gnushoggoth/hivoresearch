import pygame
import math
import random
from dataclasses import dataclass
from typing import List, Tuple

# We use dataclasses to mirror our Haskell types, making future conversion easier
@dataclass
class Blossom:
    position: Tuple[float, float]
    rotation: float
    fall_speed: float
    fade_state: float
    size: float

@dataclass
class Symbol:
    position: Tuple[float, float]
    rotation: float
    scale: float
    complexity: int  # Determines how many layers the symbol has

class DarkSakuraPreview:
    def __init__(self, width=800, height=600):
        pygame.init()
        self.width = width
        self.height = height
        self.screen = pygame.display.set_mode((width, height))
        pygame.display.set_caption("Dark Sakura Dreams - Preview")
        
        # Initialize state (mirrors our Haskell World type)
        self.blossoms: List[Blossom] = []
        self.symbols: List[Symbol] = []
        self.moon_phase = 0.0
        self.night_intensity = 0.5
        self.cursor_pos = (width // 2, height // 2)
        self.time = 0.0
        
        # Create initial elements
        self.initialize_elements()
        
        # Create surfaces for glow effects
        self.glow_surface = pygame.Surface((width, height), pygame.SRCALPHA)
        self.symbol_surface = pygame.Surface((width, height), pygame.SRCALPHA)
        
    def initialize_elements(self):
        # Create initial blossoms
        for i in range(10):
            self.blossoms.append(Blossom(
                position=(random.randint(0, self.width), random.randint(-100, 0)),
                rotation=random.random() * 360,
                fall_speed=50 + random.random() * 30,
                fade_state=1.0,
                size=5 + random.random() * 3
            ))
            
        # Create mystical symbols
        for i in range(3):
            self.symbols.append(Symbol(
                position=(self.width/2 + random.randint(-200, 200), 
                         self.height/2 + random.randint(-200, 200)),
                rotation=random.random() * 360,
                scale=0.5 + random.random() * 0.5,
                complexity=random.randint(3, 6)
            ))

    def draw_blossom(self, blossom: Blossom):
        # Create a more detailed blossom shape
        points = []
        num_petals = 5
        for i in range(num_petals):
            angle = math.radians(blossom.rotation + (i * 360 / num_petals))
            outer_point = (math.cos(angle) * blossom.size, 
                         math.sin(angle) * blossom.size)
            points.append(outer_point)
            
            # Add inner points for petal shape
            angle_left = math.radians(blossom.rotation + 
                                    (i * 360 / num_petals) - 15)
            angle_right = math.radians(blossom.rotation + 
                                     (i * 360 / num_petals) + 15)
            inner_point = (math.cos(angle) * blossom.size * 0.4,
                         math.sin(angle) * blossom.size * 0.4)
            points.extend([inner_point])

        # Draw the blossom with a glow effect
        color = (102, 0, 51, int(255 * blossom.fade_state))
        pos = (int(blossom.position[0]), int(blossom.position[1]))
        
        # Draw glow
        pygame.draw.circle(self.glow_surface, (*color[:3], 50), 
                         pos, int(blossom.size * 2))
        
        # Draw actual blossom
        scaled_points = [(x + pos[0], y + pos[1]) for x, y in points]
        pygame.draw.polygon(self.screen, color, scaled_points)

    def draw_symbol(self, symbol: Symbol):
        # Draw mystical symbols with increasing complexity
        center = symbol.position
        size = 20 * symbol.scale
        
        for i in range(symbol.complexity):
            angle = symbol.rotation + (i * 360 / symbol.complexity)
            end_point = (center[0] + math.cos(math.radians(angle)) * size,
                        center[1] + math.sin(math.radians(angle)) * size)
            
            color = (102, 0, 51, int(100 * (1 - i/symbol.complexity)))
            pygame.draw.line(self.symbol_surface, color, center, end_point, 2)

    def update(self, dt):
        self.time += dt
        
        # Update blossoms
        for blossom in self.blossoms:
            blossom.position = (blossom.position[0], 
                              blossom.position[1] + blossom.fall_speed * dt)
            blossom.rotation += dt * 45
            
            # Reset blossoms that fall off screen
            if blossom.position[1] > self.height:
                blossom.position = (random.randint(0, self.width), -10)
                blossom.fade_state = 1.0
                
        # Update symbols
        for symbol in self.symbols:
            symbol.rotation += dt * 30

    def draw(self):
        # Clear surfaces
        self.screen.fill((10, 0, 20))  # Dark background
        self.glow_surface.fill((0, 0, 0, 0))
        self.symbol_surface.fill((0, 0, 0, 0))
        
        # Draw blood moon
        moon_color = (139, 0, 0, int(255 * (0.5 + self.moon_phase)))
        pygame.draw.circle(self.screen, moon_color, (650, 150), 60)
        pygame.draw.circle(self.glow_surface, (*moon_color[:3], 50), 
                         (650, 150), 80)
        
        # Draw all elements
        for symbol in self.symbols:
            self.draw_symbol(symbol)
            
        for blossom in self.blossoms:
            self.draw_blossom(blossom)
        
        # Apply glow effects
        self.screen.blit(self.glow_surface, (0, 0), 
                        special_flags=pygame.BLEND_ALPHA_SDL2)
        self.screen.blit(self.symbol_surface, (0, 0), 
                        special_flags=pygame.BLEND_ALPHA_SDL2)
        
        pygame.display.flip()

    def run(self):
        clock = pygame.time.Clock()
        running = True
        
        while running:
            dt = clock.tick(60) / 1000.0  # Delta time in seconds
            
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                elif event.type == pygame.MOUSEMOTION:
                    self.cursor_pos = event.pos
                elif event.type == pygame.MOUSEBUTTONDOWN:
                    self.moon_phase = (self.moon_phase + 0.2) % 1.0
            
            self.update(dt)
            self.draw()

        pygame.quit()

if __name__ == "__main__":
    preview = DarkSakuraPreview()
    preview.run()