<div align="center">
    <img src="https://bun.sh/logo.svg" width="75px">
    <h1>BunChat - Realtime Chat Application</h1>
</div>

## Goal

Create a modern web app with a great developer experience while relying as much as possible on **Bun**

## How to run the project

-   From the root of the project run `bun install` followed by `bun dev`
-   This takes advantage of monorepo support in bun using the `--filter '*'` directive

## Project Stats

-   The `node_modules` folder consists of **19** packages (lower is better)

## Features

-   Real-time messaging using WebSockets
-   Server-side session authentication
-   Room-based chat system
-   Message persistence

## Technologies

-   **Frontend**: Bun v1.2 bundler, React, Tailwind CSS
-   **Backend**: Bun
-   **Database**: SQLite (using `bun:sqlite`)

## Current external dependencies

-   `react` and `react-dom`
-   `datefns`
-   `clsx` and `tailwindcss` with `bun-plugin-tailwind`
