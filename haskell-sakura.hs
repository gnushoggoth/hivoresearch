-- Dark Sakura Dreams
-- A meditation on digital decay and eternal return

import Graphics.Gloss
import Graphics.Gloss.Interface.Pure.Game
import System.Random
import Control.Monad (replicateM)
import Data.Fixed (mod')

-- | Our world state contains all the elements of our dark garden
data World = World
    { blossoms :: [Blossom]    -- Falling cherry blossoms
    , moonPhase :: Float       -- Current phase of the blood moon
    , symbols :: [Symbol]      -- Mystical symbols
    , nightIntensity :: Float  -- How deep the darkness goes
    , cursorPos :: Point       -- Where the user's cursor is
    , seed :: Int              -- For deterministic randomness
    }

-- | A cherry blossom in our dark garden
data Blossom = Blossom
    { position :: Point        -- Where the blossom is
    , rotation :: Float        -- Current rotation
    , fallSpeed :: Float      -- How fast it falls
    , fadeState :: Float      -- Current opacity
    }

-- | A mystical symbol
data Symbol = Symbol
    { symPosition :: Point     -- Where the symbol is
    , symRotation :: Float    -- Current rotation
    , symScale :: Float       -- Current size
    }

-- | Initial world state
initialWorld :: World
initialWorld = World
    { blossoms = initialBlossoms
    , moonPhase = 0
    , symbols = initialSymbols
    , nightIntensity = 0.5
    , cursorPos = (0, 0)
    , seed = 42
    }

-- | Create initial blossoms
initialBlossoms :: [Blossom]
initialBlossoms = take 5 $ map createBlossom [0..]
  where
    createBlossom i = Blossom
        { position = (fromIntegral i * 80 - 200, 300)
        , rotation = fromIntegral i * 30
        , fallSpeed = 50 + fromIntegral i * 10
        , fadeState = 1.0
        }

-- | Create initial symbols
initialSymbols :: [Symbol]
initialSymbols = 
    [ Symbol (0, 0) 0 1.0
    , Symbol (100, 100) 45 0.8
    , Symbol (-100, -100) 90 0.6
    ]

-- | Handle events (mouse movement and clicks)
handleEvent :: Event -> World -> World
handleEvent (EventMotion pos) world = world { cursorPos = pos }
handleEvent (EventKey (MouseButton LeftButton) Down _ _) world =
    world { moonPhase = (moonPhase world + 0.2) `mod'` 1
          , nightIntensity = min 1.0 (nightIntensity world + 0.1)
          }
handleEvent _ world = world

-- | Update the world state
updateWorld :: Float -> World -> World
updateWorld dt world = world
    { blossoms = map (updateBlossom dt) (blossoms world)
    , symbols = map (updateSymbol dt) (symbols world)
    , seed = nextSeed (seed world)
    }

-- | Update a single blossom
updateBlossom :: Float -> Blossom -> Blossom
updateBlossom dt blossom = blossom
    { position = (x, y - fallSpeed blossom * dt)
    , rotation = rotation blossom + dt * 45
    , fadeState = if y < -300 then 1.0 else fadeState blossom
    }
  where
    (x, y) = position blossom

-- | Update a single symbol
updateSymbol :: Float -> Symbol -> Symbol
updateSymbol dt symbol = symbol
    { symRotation = symRotation symbol + dt * 30
    }

-- | Draw the entire world
drawWorld :: World -> Picture
drawWorld world = pictures
    [ drawBackground (nightIntensity world)
    , drawMoon (moonPhase world)
    , pictures $ map drawBlossom (blossoms world)
    , pictures $ map drawSymbol (symbols world)
    , drawWisps (cursorPos world)
    ]

-- | Draw the dark background
drawBackground :: Float -> Picture
drawBackground intensity = 
    color (makeColor 0.03 0.0 0.05 1.0) $ rectangleSolid 800 600

-- | Draw the blood moon
drawMoon :: Float -> Picture
drawMoon phase = 
    translate 200 150 $ 
    color (makeColor 0.8 0.1 0.1 phase) $ 
    circleSolid 40

-- | Draw a single cherry blossom
drawBlossom :: Blossom -> Picture
drawBlossom blossom = 
    translate x y $ 
    rotate (rotation blossom) $ 
    color (makeColor 0.3 0.0 0.1 (fadeState blossom)) $ 
    pictures [blossom1, blossom2, blossom3, blossom4, blossom5]
  where
    (x, y) = position blossom
    blossom1 = circleSolid 5
    blossom2 = translate 5 0 $ circleSolid 5
    blossom3 = translate (-5) 0 $ circleSolid 5
    blossom4 = translate 0 5 $ circleSolid 5
    blossom5 = translate 0 (-5) $ circleSolid 5

-- | Draw mystical wisps following the cursor
drawWisps :: Point -> Picture
drawWisps (x, y) = 
    translate x y $ 
    color (makeColor 0.4 0.0 0.2 0.5) $ 
    pictures [ circleSolid 5
            , translate 10 10 $ circleSolid 3
            , translate (-10) (-10) $ circleSolid 3
            ]

-- | Main function to run our dark garden
main :: IO ()
main = play window background 60 initialWorld drawWorld handleEvent updateWorld
  where
    window = InWindow "Dark Sakura Dreams" (800, 600) (10, 10)
    background = black

-- Helper functions for random number generation
nextSeed :: Int -> Int
nextSeed s = (1103515245 * s + 12345) `mod` 2147483648