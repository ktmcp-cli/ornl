# AGENT.md — Daymet Weather CLI for AI Agents

This document explains how to use the Daymet Weather CLI as an AI agent.

## Overview

The `ornl` CLI provides access to daily surface weather data on a 1-km grid for North America (1980-2019) via the Daymet Single Pixel Extraction Tool API.

## All Commands

### Get Weather Data

```bash
ornl get <lat> <lon>                                    # Basic query
ornl get 36.0 -84.0 --vars tmin,tmax,prcp              # Specific variables
ornl get 36.0 -84.0 --years 2018,2019                  # Specific years
ornl get 36.0 -84.0 --start 2019-01-01 --end 2019-12-31  # Date range
ornl get 36.0 -84.0 --format csv                       # CSV output
ornl get 36.0 -84.0 --json                             # JSON output
```

### Preview

```bash
ornl preview <lat> <lon>
ornl preview 36.0 -84.0 --vars tmin,tmax
```

### Variables

```bash
ornl vars                                              # List all available variables
```

### Config

```bash
ornl config set --base-url <url>
ornl config show
```

## Available Variables

- `tmin` - Minimum Temperature (°C)
- `tmax` - Maximum Temperature (°C)
- `prcp` - Precipitation (mm/day)
- `srad` - Shortwave Radiation (W/m²)
- `vp` - Vapor Pressure (Pa)
- `swe` - Snow Water Equivalent (kg/m²)
- `dayl` - Day Length (seconds)

## Coverage

- Spatial: North America
- Temporal: 1980-2019
- Resolution: 1km × 1km grid

## Tips for Agents

1. Always use `--json` for programmatic access
2. Use `--vars` to request only needed variables
3. Use `--years` or `--start/--end` to limit data volume
4. Default format is JSON, use `--format csv` for CSV
5. Combine with `jq` for JSON processing
6. Coordinates must be in decimal degrees
