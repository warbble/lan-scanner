# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LAN Scanner is a professional network scanning application for macOS built with Electron, React, and TypeScript. It performs IPv4 network discovery with MAC address detection, hostname resolution, device type identification, and port scanning capabilities.

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build distributable DMG for macOS
npm run build

# Package the application (without creating installer)
npm run package
```

## Architecture

### Process Architecture

This is an Electron application with three distinct processes:

1. **Main Process** (`src/main/index.ts`): Node.js backend that orchestrates network scanning
2. **Renderer Process** (`src/renderer/`): React-based UI running in Chromium
3. **Preload Script** (`src/main/preload.ts`): Secure bridge exposing IPC APIs to renderer

Communication flows through IPC channels defined in `src/shared/constants.ts`.

### Scanning Pipeline

The `NetworkScanner` class (`src/main/scanner/NetworkScanner.ts`) orchestrates a multi-stage discovery pipeline:

1. **Host Discovery** - `IPv4Scanner` performs parallel ping sweep and ARP table parsing
2. **MAC Resolution** - `ArpingScanner` uses `arping` and ARP table fallback
3. **Enrichment** - Parallel hostname resolution, device detection, and port scanning
4. **Device Type Detection** - MAC vendor lookup from extensive OUI database (`src/main/utils/deviceDetection.ts`)

Each stage uses custom concurrency limiters (`src/main/utils/concurrency.ts`) to control resource usage.

### Scanner Implementations

- **IPv4Scanner** (`src/main/scanner/discovery/IPv4Scanner.ts`): Auto-detects local subnet, generates IP ranges via `ip-cidr`, performs parallel ping sweeps with configurable concurrency (default: 32), and merges results with ARP table data
- **ArpingScanner** (`src/main/scanner/discovery/ArpingScanner.ts`): Attempts `arping` first, falls back to ARP table parsing, auto-detects network interface, normalizes MAC addresses to lowercase colon-separated format
- **Port Scanner** (`src/main/utils/portScanner.ts`): Prefers `nmap` when available for performance, falls back to netcat (`nc`) for port checks, scans 19 common service ports by default, runs with concurrency limit of 20

### Build System

Uses Electron Forge with Vite plugin (`forge.config.ts`):
- Main process and preload script compiled via `vite.main.config.ts` and `vite.preload.config.ts`
- Renderer uses React with `vite.renderer.config.ts`
- Outputs DMG installer for macOS distribution

### Security Model

- Sandbox enabled with context isolation
- No Node.js integration in renderer
- Strict Content Security Policy configured in `src/main/index.ts`
- Only whitelisted IPC channels accessible via preload

## Key Implementation Details

### Concurrency Management

The custom `ConcurrencyLimiter` class provides queue-based throttling. Use `createLimiter(n)` to get a limiter function that wraps async operations. The scanner uses different concurrency limits at each stage: 32 for ping sweeps, 6 for enrichment (due to port scanning overhead), and 20 for individual port checks.

### Network Interface Detection

`IPv4Scanner.detectSubnet()` searches for non-internal interfaces starting with "en" prefix (macOS convention). It calculates CIDR notation from IP and netmask. Override auto-detection by passing `subnet` option to `scanNetwork()`.

### Device Type Detection

The `detectDeviceType()` utility (`src/main/utils/deviceDetection.ts`) contains a comprehensive MAC OUI prefix database mapping vendors to device types (router, printer, phone, etc.). This runs client-side without external API calls.

### External Tool Dependencies

Optional but recommended system tools enhance functionality:
- `arping`: More reliable MAC address discovery
- `nmap`: Faster port scanning with service detection
- `nc` (netcat): Fallback for port checking

All tools gracefully degrade if unavailable. Install via: `brew install arping arp-scan nmap`

## Type Definitions

Core types in `src/shared/types/index.ts`:
- **Device**: Represents a discovered network device with IP, MAC, hostname, vendor, ports, etc.
- **ScanOptions**: Configure subnet targeting and protocol selection
- **ScanResult**: Contains discovered devices array, scan duration, and errors
- **OpenPort**: Port number, protocol, service name, and state

## Common Development Patterns

When modifying scanning logic:
- Emit events via `NetworkScanner` EventEmitter for progress tracking
- Always wrap subprocess calls with timeout parameters
- Use `Promise.allSettled()` for bulk operations to prevent one failure from stopping others
- Normalize MAC addresses through `normalizeMac()` helper for consistent storage
- Sort IP addresses numerically, not lexicographically

When adding new scanner methods:
- Implement graceful degradation if system tools are missing
- Use appropriate concurrency limits based on operation cost
- Return partial results rather than failing entirely on errors
- Add new IPC channel constants to `src/shared/constants.ts`
