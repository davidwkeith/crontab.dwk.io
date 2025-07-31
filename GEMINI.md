# GEMINI.md

This file is used by the Gemini CLI agent to understand the project context and conventions.

## Project Overview

This is a static site generated using Eleventy. It uses WebC components for templating.

## Key Directories

- `src/`: Contains the source files for the Eleventy project.
- `_site/`: The output directory for the built site.
- `config/`: Contains Eleventy configuration files (plugins, shortcodes, etc.).
- `node_modules/`: Node.js dependencies.

## Build and Development Commands

- `npm install`: Install project dependencies.
- `npm run build`: Build the static site.
- `npm run serve`: Serve the site locally for development.
- `npm run lint`: Run ESLint for code linting.
- `npm run format`: Run Prettier for code formatting.

## Custom Web Components

Custom web components are located in `node_modules/@dwk/web-components/components/`. They are registered in `config/plugins.js`.

## Notes for Gemini

- When modifying code, prioritize maintaining existing code style and structure.
- Before making significant changes, consider running `npm run lint` and `npm run format` to ensure consistency.
- Consider writing tests if applicable to the project's testing conventions.
- Prefer vanilla JavaScript, CSS, and HTML.
- Add inline comments for hacks, workarounds, or unusual solutions.
- Add JSDoc using best practices.
- Update the README and docs/ directory if warrented.
- Stage a commit, and propose a message, but don't commit until the developer approves of the changes
