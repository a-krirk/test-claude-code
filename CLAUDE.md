# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

No build step required. Open `index.html` directly in a browser, or serve it with any static file server:

```
npx serve .
# or
python3 -m http.server
```

## Architecture

This is a zero-dependency vanilla JS to-do list app. All logic lives in three files:

- `index.html` — static shell; no templating
- `script.js` — all app logic; tasks are stored as `{id, text, completed}` objects in `localStorage` under the key `tasks`; `renderTasks()` does a full re-render of `#taskList` on every state change
- `styles.css` — self-contained styles; no preprocessor

State flow: user action → mutate `tasks` array → `saveTasks()` (writes to localStorage) → `renderTasks()` (rebuilds DOM from scratch).

Task IDs are `Date.now()` timestamps. `escapeHtml()` in `script.js` sanitizes user input before inserting into the DOM.
