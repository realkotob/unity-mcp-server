# Changelog

All notable changes to this package will be documented in this file.

## [2.27.0] - 2026-03-25

### Added
- **UMA (Unity Multipurpose Avatar) integration** — 13 new tools for the complete UMA asset pipeline:
  - `uma/inspect-fbx` — Inspect FBX meshes for UMA compatibility
  - `uma/create-slot` — Create SlotDataAsset from mesh data
  - `uma/create-overlay` — Create OverlayDataAsset with texture assignments
  - `uma/create-wardrobe-recipe` — Create WardrobeRecipe combining slots and overlays
  - `uma/create-wardrobe-from-fbx` — Atomic FBX-to-wardrobe pipeline (inspect → slot → overlay → recipe in one call)
  - `uma/wardrobe-equip` — Equip/unequip wardrobe items on DynamicCharacterAvatar
  - `uma/list-global-library` — Browse the UMA Global Library contents
  - `uma/list-wardrobe-slots` — List available wardrobe slots
  - `uma/list-uma-materials` — List UMA-compatible materials
  - `uma/get-project-config` — Get UMA project configuration
  - `uma/verify-recipe` — Validate a WardrobeRecipe for missing references
  - `uma/rebuild-global-library` — Force rebuild the Global Library index
  - `uma/register-assets` — Register Slot/Overlay/Recipe assets in the Global Library
- New `uma-bridge.js` module — UMA bridge functions extracted into a dedicated module
- New `uma-tools.js` — Full tool definitions and schemas for all UMA tools

## [2.26.0] - 2026-03-25

### Added
- **Compilation error detection** — New `unity_get_compilation_errors` tool retrieves C# compilation errors and warnings via `CompilationPipeline` API, independent of console log buffer
- **Test Runner integration** — Run EditMode/PlayMode tests, poll results, list available tests via Unity Test Runner API

## [2.25.0] - 2026-03-09

### Added
- **Parallel-safe instance routing** — Per-request `port` parameter on every `unity_*` tool call for multi-agent safety
- **Per-request port override** — Stateless routing mechanism bypassing shared per-agent state
- **Schema injection** — Optional `port` parameter auto-injected into every `unity_*` tool schema
- **Enhanced select_instance response** — Explicit routing instructions for AI assistants
