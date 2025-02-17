import speech_recognition as sr
import pygame
import threading
import time
from pydub import AudioSegment
from pydub.playback import play
import random
import os

class HarbingerWhisper:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        
        # Initialize pygame for ambient sounds
        pygame.mixer.init()
        
        # Load ambient sounds
        self.ambient_sounds = [
            pygame.mixer.Sound("moth_wings.wav"),
            pygame.mixer.Sound("static_whisper.wav"),
            pygame.mixer.Sound("distant_chant.wav")
        ]
        
        # Predefined responses inspired by the Harbinger's message
        self.harbinger_responses = [
            "The Archive of Lost Things awaits your voice...",
            "Speak, and let your essence flow into the digital realm.",
            "Your words are the key to unlocking hidden truths.",
            "The Mothman's gaze pierces through layers of reality.",
            "Whisper your secrets, and watch them transform."
        ]
        
        # Initialize the transformation progress
        self.transformation_progress = 0
        
    def play_ambient_sound(self):
        """Play random ambient sounds in the background"""
        while True:
            sound = random.choice(self.ambient_sounds)
            sound.play()
            time.sleep(random.uniform(5, 15))  # Random interval between sounds
    
    def transcribe_audio(self):
        """Capture audio and convert to text"""
        print("Speak into the void, and let the Harbinger hear your voice...")
        
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source)
            audio = self.recognizer.listen(source)
        
        try:
            text = self.recognizer.recognize_google(audio)
            return text
        except sr.UnknownValueError:
            return "The void echoes with silence..."
        except sr.RequestError:
            return "The digital spirits are restless. Try again."
    
    def transform_text(self, text):
        """Apply a 'transformation' effect to the text"""
        transformed = ""
        for char in text:
            if random.random() < 0.1:  # 10% chance to modify each character
                transformed += random.choice("!@#$%^&*")
            else:
                transformed += char
            
            # Simulate transformation progress
            self.transformation_progress += 1
            if self.transformation_progress % 10 == 0:
                print(f"Transformation progress: {self.transformation_progress}%")
        
        return transformed
    
    def generate_response(self, text):
        """Generate a cryptic response based on the input"""
        keywords = ["archive", "lost", "mothman", "harbinger", "whisper", "shadow"]
        
        if any(keyword in text.lower() for keyword in keywords):
            return random.choice(self.harbinger_responses)
        else:
            return "Your words ripple through the Archive, seeking meaning..."
    
    def save_to_archive(self, original, transformed):
        """Save the original and transformed text to a file"""
        with open("archive_of_lost_things.txt", "a") as archive:
            archive.write(f"Original Whisper: {original}\n")
            archive.write(f"Transformed Essence: {transformed}\n")
            archive.write("-" * 50 + "\n")
    
    def run(self):
        """Main loop for the Harbinger's Whisper program"""
        print("Welcome to the Archive of Lost Things...")
        print("The Harbinger awaits your voice.")
        
        # Start the ambient sound thread
        sound_thread = threading.Thread(target=self.play_ambient_sound)
        sound_thread.daemon = True
        sound_thread.start()
        
        while True:
            original_text = self.transcribe_audio()
            print(f"You spoke: {original_text}")
            
            transformed_text = self.transform_text(original_text)
            print(f"Transformed whisper: {transformed_text}")
            
            response = self.generate_response(original_text)
            print(f"The Harbinger responds: {response}")
            
            self.save_to_archive(original_text, transformed_text)
            
            print("\nThe Archive awaits your next whisper...")
            time.sleep(2)  # Pause before next iteration

if __name__ == "__main__":
    harbinger = HarbingerWhisper()
    harbinger.run()

# Note: This script requires the following Python libraries:
# - speech_recognition
# - pygame
# - pydub
# 
# Install them using pip:
# pip install SpeechRecognition pygame pydub
#
# You'll also need to have audio files (moth_wings.wav, static_whisper.wav, distant_chant.wav)
# in the same directory as this script for the ambient sounds to work.
