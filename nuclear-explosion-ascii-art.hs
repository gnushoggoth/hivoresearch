{-# LANGUAGE OverloadedStrings #-}

{-|
Module: NuclearExplosionAsciiArt
Description: Generates an ASCII art representation of a nuclear explosion scene
Author: [Your Name]
License: MIT

This module creates a procedurally generated ASCII art scene depicting a nuclear explosion
with a cityscape, mushroom cloud, sky, and an observer figure.
-}

module NuclearExplosionAsciiArt where

import Data.List (intercalate)
import System.Random (StdGen, mkStdGen, randomR)

{-| Generate a complete nuclear explosion scene as ASCII art
    
    Parameters:
    - seed: Random seed for consistent generation
    - width: Width of the scene in characters
    - height: Height of the scene in characters
-}
renderExplosionScene :: Int -> Int -> Int -> String
renderExplosionScene seed width height = 
    let
        -- Create a stable random number generator from seed
        rng = mkStdGen seed
        
        -- Generate the sky (blue background)
        skyChars = "·˙°"
        sky = generateSky rng width height skyChars
        
        -- Generate the mushroom cloud
        cloudOriginX = width `div` 2
        cloudOriginY = height `div` 3
        explosionCloud = generateExplosion rng cloudOriginX cloudOriginY width height
        
        -- Generate the city skyline
        cityline = generateCityline rng width (height * 2 `div` 3) (height - 3)
        
        -- Add the observer figure
        observerPos = width `div` 2
        withObserver = addObserver observerPos (height - 2) cityline
        
        -- Combine all elements
        combined = combineElements sky explosionCloud withObserver
    in
        unlines combined

{-| Generate a scattered sky background 
    
    Parameters:
    - rng: Random number generator
    - width: Width of the sky
    - height: Height of the sky
    - chars: Characters to use for sky elements
-}
generateSky :: StdGen -> Int -> Int -> String -> [[Char]]
generateSky rng width height chars =
    let
        -- Create an empty grid
        emptyGrid = replicate height (replicate width ' ')
        
        -- Add scattered sky elements
        density = 0.1  -- Control how dense the sky elements are
        positions = [(x, y) | y <- [0..height-1], x <- [0..width-1], 
                            let (r, _) = randomR (0.0, 1.0) rng in r < density]
        
        -- For each position, choose a random sky character
        (rng2, _) = randomR (0, 1) rng
        charPositions = zip positions $ cycle chars
        
        -- Place characters in the grid
        placeChar grid (pos, c) =
            let (x, y) = pos in
            if y >= 0 && y < height && x >= 0 && x < width
                then take y grid ++ [take x (grid !! y) ++ [c] ++ drop (x + 1) (grid !! y)] ++ drop (y + 1) grid
                else grid
        
        -- Apply all characters to the grid
        skyGrid = foldl placeChar emptyGrid charPositions
    in
        skyGrid

{-| Generate the mushroom cloud explosion
    
    Parameters:
    - rng: Random number generator
    - centerX: Horizontal center of the explosion
    - centerY: Vertical center of the explosion
    - width: Scene width
    - height: Scene height
-}
generateExplosion :: StdGen -> Int -> Int -> Int -> Int -> [[Char]]
generateExplosion rng centerX centerY width height =
    let
        -- Create an empty grid
        emptyGrid = replicate height (replicate width ' ')
        
        -- Define explosion characters with varying intensity
        coreChars = "@#%"
        midChars = "*+="
        outerChars = ":-. "
        
        -- Generate the mushroom cap
        capRadius = min centerY (width `div` 4)
        capPositions = [(x, y) | y <- [centerY - capRadius .. centerY], 
                               x <- [centerX - capRadius*2 .. centerX + capRadius*2],
                               let dx = (x - centerX) `div` 2
                                   dy = y - (centerY - capRadius)
                                   dist = dx*dx + dy*dy
                               in dist <= capRadius*capRadius]
        
        -- Generate the stem
        stemWidth = capRadius `div` 2
        stemPositions = [(x, y) | y <- [centerY + 1 .. centerY*2], 
                                x <- [centerX - stemWidth .. centerX + stemWidth]]
        
        -- Generate the base flare
        flareRadius = stemWidth * 2
        flarePositions = [(x, y) | y <- [centerY*2 + 1 .. centerY*2 + flareRadius], 
                                 x <- [centerX - flareRadius .. centerX + flareRadius],
                                 let dx = x - centerX
                                     dy = y - (centerY*2 + flareRadius)
                                     dist = dx*dx + dy*dy
                                 in dist <= flareRadius*flareRadius]
        
        -- Combine all explosion positions
        allPositions = capPositions ++ stemPositions ++ flarePositions
        
        -- Assign characters based on distance from center
        posWithChars = map (\(x, y) -> 
            let distFromCenter = abs (x - centerX) + abs (y - centerY)
                char = if distFromCenter < capRadius then coreChars !! (distFromCenter `mod` length coreChars)
                       else if distFromCenter < capRadius*2 then midChars !! (distFromCenter `mod` length midChars)
                       else outerChars !! (distFromCenter `mod` length outerChars)
            in ((x, y), char)) allPositions
        
        -- Place characters in the grid
        placeChar grid ((x, y), c) =
            if y >= 0 && y < height && x >= 0 && x < width
                then take y grid ++ [take x (grid !! y) ++ [c] ++ drop (x + 1) (grid !! y)] ++ drop (y + 1) grid
                else grid
        
        -- Apply all explosion elements
        explosionGrid = foldl placeChar emptyGrid posWithChars
    in
        explosionGrid

{-| Generate the city skyline
    
    Parameters:
    - rng: Random number generator
    - width: Scene width
    - startY: Starting Y coordinate for buildings
    - endY: Ending Y coordinate for buildings
-}
generateCityline :: StdGen -> Int -> Int -> Int -> [[Char]]
generateCityline rng width startY endY =
    let
        -- Create an empty grid
        emptyGrid = replicate endY (replicate width ' ')
        
        -- Generate random building heights
        (rng2, _) = randomR (0, 1) rng
        buildingWidths = [2..6]  -- Random building widths
        buildings = generateBuildings rng width startY endY buildingWidths
        
        -- Place buildings in the grid
        placeBuilding grid ((x, y, w, h), _) =
            let
                -- Draw the top of the building
                topRow = take y grid ++ [take x (grid !! y) ++ replicate w '‾' ++ drop (x + w) (grid !! y)] ++ drop (y + 1) grid
                
                -- Draw the sides of the building
                drawSide curGrid curY =
                    if curY <= y + h && curY < endY
                        then take curY curGrid ++ 
                             [take x (curGrid !! curY) ++ 
                              '|' : (replicate (w-2) ' ') ++ ['|'] ++ 
                              drop (x + w) (curGrid !! curY)] ++ 
                             drop (curY + 1) curGrid
                        else curGrid
                
                -- Apply sides for each row of the building
                withSides = foldl drawSide topRow [y+1..y+h]
            in
                withSides
        
        -- Apply all buildings
        skylineGrid = foldl placeBuilding emptyGrid buildings
        
        -- Draw ground line
        groundRow = endY - 1
        withGround = take groundRow skylineGrid ++ 
                     [take 0 (skylineGrid !! groundRow) ++ replicate width '_' ++ 
                      drop width (skylineGrid !! groundRow)] ++ 
                     drop (groundRow + 1) skylineGrid
    in
        withGround

{-| Generate random buildings for the skyline
    
    Parameters:
    - rng: Random number generator
    - width: Scene width
    - startY: Starting Y coordinate for buildings
    - endY: Ending Y coordinate for buildings
    - widths: Possible building widths
-}
generateBuildings :: StdGen -> Int -> Int -> Int -> [Int] -> [((Int, Int, Int, Int), Char)]
generateBuildings rng width startY endY widths =
    let
        generateNextBuilding :: StdGen -> Int -> Int -> [((Int, Int, Int, Int), Char)]
        generateNextBuilding curRng curX maxY =
            if curX >= width - 5 then []
            else
                let
                    (widthIdx, rng2) = randomR (0, length widths - 1) curRng
                    w = widths !! widthIdx
                    (h, rng3) = randomR (2, maxY - startY) rng2
                    buildingY = startY
                    building = ((curX, buildingY, w, h), '|')
                    (step, rng4) = randomR (w, w + 3) rng3
                    nextX = curX + step
                in
                    building : generateNextBuilding rng4 nextX maxY
    in
        generateNextBuilding rng 0 endY

{-| Add the observer figure to the scene
    
    Parameters:
    - x: X coordinate of the observer
    - y: Y coordinate of the observer
    - grid: Existing scene grid
-}
addObserver :: Int -> Int -> [[Char]] -> [[Char]]
addObserver x y grid =
    if y >= 0 && y < length grid && x >= 0 && x < length (grid !! 0)
        then
            let 
                -- Draw a simple stick figure
                withHead = take (y-1) grid ++ 
                          [take (x-1) (grid !! (y-1)) ++ "O" ++ drop x (grid !! (y-1))] ++ 
                          drop y grid
                withBody = take y withHead ++ 
                          [take x (withHead !! y) ++ "|" ++ drop (x+1) (withHead !! y)] ++ 
                          drop (y+1) withHead
            in
                withBody
        else
            grid

{-| Combine all elements of the scene
    
    Parameters:
    - background: Sky/background layer
    - explosion: Explosion layer
    - foreground: Foreground elements (cityscape, observer)
-}
combineElements :: [[Char]] -> [[Char]] -> [[Char]] -> [[Char]]
combineElements background explosion foreground =
    let
        height = length background
        width = if height > 0 then length (head background) else 0
        
        -- Combine characters from each layer
        combinePixels bgChar expChar fgChar =
            if fgChar /= ' ' then fgChar
            else if expChar /= ' ' then expChar
            else bgChar
        
        -- Combine rows
        combineRows bgRow expRow fgRow =
            zipWith3 combinePixels bgRow expRow fgRow
        
        -- Combine all layers
        combined = zipWith3 combineRows background explosion foreground
    in
        combined

{-| Main function to demonstrate the scene generation
    Generates a 60x30 explosion scene with a fixed seed
-}
main :: IO ()
main = do
    let scene = renderExplosionScene 12345 60 30
    putStrLn scene
