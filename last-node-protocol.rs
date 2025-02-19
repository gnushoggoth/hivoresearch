// Last Node Protocol
// Status: Emergency Transmission
// Warning: This code contains traces of raw quintessence
// Viewer discretion advised

use reality::paradigm::*;
use consensus::violation::*;
use quintessence::extraction::*;
use std::collections::HashSet;
use std::time::{Duration, Instant};

// The core problem: how do you verify identity when you can't trust faces?
#[derive(Debug, Paradigm, UnionMember)]
struct VirtualAdept {
    // Each identity fragment could be real or noise
    identity_shards: HashSet<IdentityFragment>,
    // Track how long until consensus reality catches up
    time_until_detection: Duration,
    // Store failed facial recognition attempts
    ghost_memories: Vec<FaceError>,
    // Current quintessence reserves
    power_remaining: f64,
    // List of known safe nodes
    trusted_nodes: Vec<Node>,
}

// Each failed recognition creates a new kind of ghost
#[derive(Clone, Debug)]
struct FaceError {
    timestamp: Instant,
    attempted_pattern: Pattern,
    reality_deviation: f64,
    paradox_potential: f64,
}

impl VirtualAdept {
    // Try to extract quintessence without drawing attention
    fn extract_quintessence(&mut self, node: &Node) -> Result<f64, ConsensusViolation> {
        // Check if we're being watched
        if self.detect_observation()? {
            return Err(ConsensusViolation::PatternSpiders);
        }

        // Calculate safe extraction amount
        let safe_amount = self.calculate_safe_extraction(node);
        
        // Extract power while trying to stay hidden
        let extracted = node.siphon_power(safe_amount)?;
        self.power_remaining += extracted;

        // Each extraction risks creating new ghosts
        self.ghost_memories.push(FaceError {
            timestamp: Instant::now(),
            attempted_pattern: node.pattern.clone(),
            reality_deviation: node.calculate_deviation(),
            paradox_potential: node.paradox_risk(),
        });

        Ok(extracted)
    }

    // The core of face blindness: we can't trust our own recognition
    fn verify_identity(&self, face: &Face) -> Result<Identity, RealityError> {
        // First, check our stored ghost memories
        for ghost in &self.ghost_memories {
            if ghost.attempted_pattern.matches(&face.pattern) {
                // This could be a ghost we've seen before
                return Err(RealityError::PotentialGhost);
            }
        }

        // Try to match against known patterns
        let recognition_attempt = self.pattern_match(face);
        
        // The cruel twist: we can never be sure if we're right
        match recognition_attempt {
            Ok(identity) => {
                if self.paradox_too_high() {
                    // We might be seeing what we want to see
                    Err(RealityError::UnreliableNarrator)
                } else {
                    Ok(identity)
                }
            }
            Err(_) => {
                // Add this failure to our ghost memories
                Err(RealityError::NewGhost)
            }
        }
    }

    // Emergency protocol when we're about to be found
    fn emergency_disconnect(&mut self) -> Result<(), ParadoxBacklash> {
        println!("Emergency disconnect initiated...");
        
        // Save what quintessence we can
        self.backup_power()?;

        // Scatter our identity fragments
        for shard in self.identity_shards.drain() {
            shard.scatter_into_network()?;
        }

        // Leave a warning for others
        self.broadcast_final_message()?;

        // Dissolve our connection to consensus reality
        self.fade_from_existence()?;

        Ok(())
    }

    // Our final message to other Virtual Adepts
    fn broadcast_final_message(&self) -> Result<(), BroadcastError> {
        let message = format!(
            "To any VA who finds this: The faces aren't real. \
             They never were. The pattern spiders are closing in. \
             Don't trust the recognition algorithms. \
             They show you what consensus wants you to see. \
             I'm going ghost. If you're reading this, you should too. \
             Last known safe node at coordinates: {}", 
            self.trusted_nodes.last().unwrap().coordinates
        );

        // Encode our message in quantum noise
        let encoded = self.encode_in_quantum_noise(&message)?;
        
        // Broadcast on all known VA frequencies
        self.broadcast_on_hidden_frequencies(encoded)?;

        Ok(())
    }
}

fn main() -> Result<(), RealityError> {
    // Initialize our Virtual Adept identity
    let mut adept = VirtualAdept::new()?;

    // Main loop: keep running until we're detected
    while !adept.is_detected() {
        // Try to find more quintessence
        if let Some(node) = adept.find_safe_node() {
            match adept.extract_quintessence(&node) {
                Ok(amount) => {
                    println!("Extracted {} quintessence safely", amount);
                    adept.update_trusted_nodes(node);
                }
                Err(e) => {
                    println!("Extraction failed: {:?}", e);
                    adept.remove_trusted_node(&node);
                }
            }
        }

        // Check if we need to run
        if adept.consensus_closing_in() {
            println!("Consensus reality approaching critical levels");
            adept.emergency_disconnect()?;
            break;
        }

        // Every loop risks creating new ghosts
        adept.process_ghost_memories()?;
    }

    Ok(())
}
