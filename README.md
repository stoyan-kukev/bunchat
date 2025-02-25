<div align="center">
    <img src="https://bun.sh/logo.svg" width="75px">
    <h1>BunChat - Realtime Chat Application</h1>
</div>

## Goal

Create a modern web app with a great developer experience while relying as much as possible on **Bun**

## How to run the project

-   From the root of the project run `bun install` followed by `bun dev`

## Project Stats

-   Methodology: Whatever number Bun says on a clean `bun install`
-   The `node_modules` folder consists of **12** packages (lower is better)

### Dependency Count History

| Date       | Dependencies | Change |
| ---------- | ------------ | ------ |
| 2025.02.05 | 19           | -      |
| 2025.02.25 | 12           | -7 📉  |

-   Reason for decrease on 2025.02.25:
    -   Upgraded to Bun v1.2.3
    -   Removed unnecessary @types dependencies

## Features

-   Real-time messaging using WebSockets
-   Server-side session authentication
-   Room-based chat system
-   Message persistence

## Technologies

-   **Frontend**: Bun Bundler, React, Tailwind CSS
-   **Backend**: Bun Router, Bun SQLite

## Current external dependencies

-   `react` and `react-dom`
-   `datefns`
-   `clsx` and `tailwindcss` with `bun-plugin-tailwind`
