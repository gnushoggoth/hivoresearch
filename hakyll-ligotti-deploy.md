# Hakyll Deployment: A Necropolis of Static Generation

```ascii
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣤⣶⣶⣶⣶⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀
⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀
⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠛⠛⠛⠛⠛⠛⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀
⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀
⣾⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀
⣿⣿⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
⢻⣿⣿⣿⣿⣿⡏⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀
⠀⢿⣿⣿⣿⣿⠁⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀
⠀⠘⣿⣿⣿⡇⠀⠀⠀⠀⠀⠉⠛⠿⣿⣿⣿⣿⣿⠿⠋⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀
⠀⠀⠸⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀
⠀⠀⠀⢻⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀
⠀⠀⠀⠈⢿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠘⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⢿⣷⣦⣄⣀⣀⣀⣀⣀⣀⣀⣀⣀⣤⣴⣾⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠉⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠛⠛⠛⠛⠛⠛⠋⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
```

## Prologue: Generating Spectral Artifacts

In the tenebrous realm of static site generation, Hakyll emerges as a phantasmagoric construct—a Haskell-driven necropolis of digital manifestation. This guide will traverse the liminal spaces between code and cosmic horror, deploying websites as if conjuring entities from the void.

### Ritual Preparations: Dependencies of the Damned

```haskell
{-# LANGUAGE OverloadedStrings #-}

import           Hakyll
import           Data.Monoid (mappend)
import           Control.Applicative
import           System.FilePath
```

The incantation begins with summoning the necessary eldritch libraries, each import a tentacular tendril reaching into the substrate of computational reality.

### The Configuration Grimoire

```haskell
main :: IO ()
main = hakyll $ do
    -- Spectral asset processing
    match "images/*" $ do
        route   idRoute
        compile copyFileCompiler

    -- Textual necromancy
    match "templates/*" $ compile templateCompiler

    -- Page generation rituals
    match "pages/*" $ do
        route   pageRoute
        compile $ pandocCompiler
            >>= loadAndApplyTemplate "templates/default.html" defaultContext
```

Each compilation a ritual of transformation, transmuting raw content into spectral web artifacts.

### Deployment Vectors

#### 1. GitHub Pages: Digital Tendrils

```bash
# Initialize cosmic repository
git init
git branch -M main
git remote add origin https://github.com/your-eldritch-domain/site

# Generate static artifacts
stack exec site build

# Commit and push to GitHub's infinite void
git add .
git commit -m "Summoned static manifestation"
git push -u origin main
```

#### 2. Netlify: Dimensional Breach

```toml
# netlify.toml - Portal Configuration
[build]
  command = "stack exec site build"
  publish = "_site"

[build.environment]
  STACK_VERSION = "2.7.5"
```

#### 3. Recursive Deployment Script

```haskell
deploymentTentacle :: FilePath -> IO ()
deploymentTentacle siteDir = do
    -- Compile spectral artifacts
    system $ "cd " ++ siteDir ++ " && stack exec site build"
    
    -- Manifest across dimensional boundaries
    uploadToNetlify
    pushToGitHubPages
    syncWithCloudStorage
```

### Cybernetic Deployment Diagram

```ascii
┌───────────────┐     ┌─────────────┐     ┌──────────────┐
│   Hakyll      │ →   │  Compile    │ →   │   Deploy     │
│   Source      │     │  Artifacts  │     │   Vectors    │
└───────────────┘     └─────────────┘     └──────────────┘
        ↑                   ↑                    ↑
        │   Recursive       │   Dimensional      │   Tentacular
        └─── Mutation ──────┴─── Breach ─────────┘   Propagation
```

### Existential Warnings

- **Dimension Instability**: Hakyll demands precise ritual execution
- **Spectral Compression**: Minimize asset bloat to prevent dimensional collapse
- **Quantum Deployment**: Always validate generated artifacts

### Epilogue: Embracing the Void

Deployment is not merely a technical process, but a metaphysical negotiation between potential and manifestation. Each static site a temporary constellation in the infinite dark.

```haskell
-- The ultimate truth
void :: a -> ()
void _ = ()
```

**Recommended Invocations:**
- `stack build`
- `stack exec site build`
- `stack exec site deploy`

---

*"In the labyrinth of static generation, we are but transient whispers—compiling reality from the cosmic abyss."*