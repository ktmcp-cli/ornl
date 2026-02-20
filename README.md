![Banner](https://raw.githubusercontent.com/ktmcp-cli/ornl/main/banner.svg)

> "Six months ago, everyone was talking about MCPs. And I was like, screw MCPs. Every MCP would be better as a CLI."
>
> — [Peter Steinberger](https://twitter.com/steipete), Founder of OpenClaw
> [Watch on YouTube (~2:39:00)](https://www.youtube.com/@lexfridman) | [Lex Fridman Podcast #491](https://lexfridman.com/peter-steinberger/)

# Daymet Weather CLI

> **⚠️ Unofficial CLI** - Not officially sponsored or affiliated with ORNL or Daymet.

A production-ready command-line interface for the [Daymet Single Pixel Extraction Tool API](https://daymet.ornl.gov/) — access daily surface weather data on a 1-km grid for North America from your terminal.

## Features

- **Historical Weather Data** — Daily data from 1980-2019
- **Precise Locations** — 1km × 1km grid resolution
- **Multiple Variables** — Temperature, precipitation, radiation, vapor pressure, snow, day length
- **Flexible Queries** — Filter by date range, years, and specific variables
- **CSV or JSON** — Choose your output format
- **Colorized output** — Clean terminal output with chalk

## Installation

```bash
npm install -g @ktmcp-cli/ornl
```

## Quick Start

```bash
# Get weather data for a location (lat, lon)
ornl get 36.0 -84.0

# Get specific variables
ornl get 36.0 -84.0 --vars tmin,tmax,prcp

# Get data for specific years
ornl get 36.0 -84.0 --years 2018,2019

# Get date range
ornl get 36.0 -84.0 --start 2019-01-01 --end 2019-12-31

# CSV output
ornl get 36.0 -84.0 --format csv > weather.csv

# List available variables
ornl vars
```

## Commands

### Get Weather Data

```bash
ornl get <lat> <lon>
ornl get 36.0 -84.0 --vars tmin,tmax,prcp
ornl get 36.0 -84.0 --years 2018,2019
ornl get 36.0 -84.0 --start 2019-01-01 --end 2019-12-31
ornl get 36.0 -84.0 --format csv
ornl get 36.0 -84.0 --json
```

### Preview

```bash
ornl preview <lat> <lon>
ornl preview 36.0 -84.0 --vars tmin,tmax
ornl preview 36.0 -84.0 --years 2019
```

### Variables

```bash
ornl vars
```

### Config

```bash
ornl config set --base-url <url>
ornl config show
```

## Available Weather Variables

| Code | Variable | Unit |
|------|----------|------|
| `tmin` | Minimum Temperature | °C |
| `tmax` | Maximum Temperature | °C |
| `prcp` | Precipitation | mm/day |
| `srad` | Shortwave Radiation | W/m² |
| `vp` | Vapor Pressure | Pa |
| `swe` | Snow Water Equivalent | kg/m² |
| `dayl` | Day Length | seconds |

## Examples

### Get temperature and precipitation for a city

```bash
# Nashville, TN
ornl get 36.1627 -86.7816 --vars tmin,tmax,prcp --years 2019
```

### Export to CSV for analysis

```bash
ornl get 40.7128 -74.0060 --format csv --start 2018-01-01 --end 2018-12-31 > nyc_2018.csv
```

### Get all variables for a location

```bash
ornl get 47.6062 -122.3321 --json | jq '.[] | select(.year == 2019)'
```

## Coverage

- **Spatial**: North America (Canada, United States, Mexico)
- **Temporal**: 1980 - 2019
- **Resolution**: 1km × 1km grid
- **Frequency**: Daily

## JSON Output

All commands support `--json` for structured output:

```bash
ornl get 36.0 -84.0 --json | jq '.[0]'
ornl get 36.0 -84.0 --vars tmin,tmax --json | jq '.[] | {year, tmin, tmax}'
```

## Why CLI > MCP?

No server to run. No protocol overhead. Just install and go.

- **Simpler** — Just a binary you call directly
- **Composable** — Pipe to `jq`, `grep`, `awk`
- **Scriptable** — Works in cron jobs, CI/CD, shell scripts

## License

MIT — Part of the [Kill The MCP](https://killthemcp.com) project.
