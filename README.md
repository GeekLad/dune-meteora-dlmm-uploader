# Meteora DLMM Uploader

## Overview

This is simple script to load the
`dune.geeklad.dataset_meteora_dlmm_api_market_data` data table in Dune. The
table contains all of the elements available from the `/pair/all` endpoint
of the Meteora DLMM API. It uses [Bun](https://bun.sh), because it eliminates
all friction with setting up the development environment.

## Usage

- Install [Bun](https://bun.sh)
- Create a `.env` with the Dune API key in a variable called
  `DUNE_API_KEY`.
- Install dependencies: `bun install`
- Run it: `bun start`

This project was created using `bun init` in bun v1.0.27. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
