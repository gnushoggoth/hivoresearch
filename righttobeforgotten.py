import pygame
import random
import json
from pathlib import Path

class GDPRPlatformer:
    def __init__(self):
        pygame.init()
        self.width = 800
        self.height = 600
        self.screen = pygame.display.set_mode((self.width, self.height))
        pygame.display.set_caption("GDPR: Right to Be Forgotten")
        
        # Colors
        self.WHITE = (255, 255, 255)
        self.BLACK = (0, 0, 0)
        self.RED = (255, 0, 0)
        self.BLUE = (0, 0, 255)
        
        # Player data - simulating stored user information
        self.player_data = {
            "position": [100, 500],
            "jumps": 0,
            "coins_collected": 0,
            "time_played": 0
        }
        
        # Game objects
        self.platform_height = 40
        self.player_size = 30
        self.gravity = 0.8
        self.jump_power = -15
        self.velocity_y = 0
        self.on_ground = False
        
        # Data collection points (coins)
        self.data_points = []
        self.generate_data_points()
        
        # GDPR interface elements
        self.deletion_requested = False
        self.deletion_button = pygame.Rect(10, 10, 150, 30)
        self.clock = pygame.time.Clock()
        
    def generate_data_points(self):
        """Create coins that represent different types of user data being collected"""
        for _ in range(5):
            x = random.randint(100, self.width - 100)
            y = random.randint(200, self.height - 200)
            self.data_points.append([x, y])
    
    def handle_deletion_request(self):
        """Simulate GDPR data deletion process"""
        if self.deletion_requested:
            # Clear all stored player data
            self.player_data = {
                "position": self.player_data["position"],  # Keep only current session data
                "jumps": 0,
                "coins_collected": 0,
                "time_played": 0
            }
            # Remove collected data points
            self.data_points = []
            self.deletion_requested = False
            
            # In a real game, you would also:
            # 1. Delete user data from your database
            # 2. Remove analytics data
            # 3. Clear cached user information
            # 4. Send confirmation email
            # 5. Document the deletion request and action taken
    
    def save_game_data(self):
        """Demonstrate data storage (in real game, use proper database)"""
        data_file = Path("player_data.json")
        with open(data_file, 'w') as f:
            json.dump(self.player_data, f)
    
    def run(self):
        running = True
        while running:
            # Handle events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                
                if event.type == pygame.MOUSEBUTTONDOWN:
                    # Check if deletion button was clicked
                    if self.deletion_button.collidepoint(event.pos):
                        self.deletion_requested = True
                        
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE and self.on_ground:
                        self.velocity_y = self.jump_power
                        self.player_data["jumps"] += 1
            
            # Update player position
            keys = pygame.key.get_pressed()
            if keys[pygame.K_LEFT]:
                self.player_data["position"][0] -= 5
            if keys[pygame.K_RIGHT]:
                self.player_data["position"][0] += 5
            
            # Apply gravity
            self.velocity_y += self.gravity
            self.player_data["position"][1] += self.velocity_y
            
            # Check ground collision
            if self.player_data["position"][1] >= self.height - self.platform_height - self.player_size:
                self.player_data["position"][1] = self.height - self.platform_height - self.player_size
                self.velocity_y = 0
                self.on_ground = True
            else:
                self.on_ground = False
            
            # Check data point collection
            player_rect = pygame.Rect(
                self.player_data["position"][0],
                self.player_data["position"][1],
                self.player_size,
                self.player_size
            )
            
            for point in self.data_points[:]:
                point_rect = pygame.Rect(point[0], point[1], 20, 20)
                if player_rect.colliderect(point_rect):
                    self.data_points.remove(point)
                    self.player_data["coins_collected"] += 1
            
            # Handle GDPR deletion requests
            if self.deletion_requested:
                self.handle_deletion_request()
            
            # Draw everything
            self.screen.fill(self.WHITE)
            
            # Draw platform
            pygame.draw.rect(self.screen, self.BLACK, 
                           (0, self.height - self.platform_height, self.width, self.platform_height))
            
            # Draw player
            pygame.draw.rect(self.screen, self.BLUE,
                           (self.player_data["position"][0], 
                            self.player_data["position"][1],
                            self.player_size, self.player_size))
            
            # Draw data points
            for point in self.data_points:
                pygame.draw.circle(self.screen, self.RED, (point[0], point[1]), 10)
            
            # Draw GDPR deletion button
            pygame.draw.rect(self.screen, self.RED, self.deletion_button)
            font = pygame.font.Font(None, 24)
            text = font.render("Delete My Data", True, self.WHITE)
            self.screen.blit(text, (20, 15))
            
            # Draw player stats
            stats_text = font.render(
                f"Jumps: {self.player_data['jumps']} | Data Collected: {self.player_data['coins_collected']}", 
                True, self.BLACK
            )
            self.screen.blit(stats_text, (200, 15))
            
            pygame.display.flip()
            self.clock.tick(60)
            
            # Update time played
            self.player_data["time_played"] += 1/60  # Add seconds
        
        pygame.quit()

if __name__ == "__main__":
    game = GDPRPlatformer()
    game.run()
