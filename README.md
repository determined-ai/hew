# Determined-UI

Determined-UI is a UI kit containing useful react components and common styles
for products by determined.ai.

## How to use

We're currently unpublished while we set up an NPM organization, so install from
the github repo like this:

```bash
npm install https://github.com/determined-ai/determined-ui.git
```

Components are exported both at the top level module and as individual modules:

```tsx
import { Avatar } from 'determined-ui';
import Card from 'determined-ui/kit/Card';
```

Related styling is imported alongside the module as a css file. Be sure your
build solution knows how to resolve `.css` imports.

## How to develop

Development requires Node.js version >= 18.

Bundling and the dev server is handled by vite. Run `npm start` or `npm run dev`
to start a dev server pointing to the design kit page.

When adding a new component, remember to:

- Add and document its functionality in the Design Kit (`src/DesignKit.tsx`)
- Aggregate its public facing exports in the index file (`src/index.ts`)

If the component is in a folder with an index module, remember to add the export to `package.json`

## How to release

With your changes safely in the main branch, run:

```sh
npm version patch # also takes minor or major
```

to bump the version number of the package as well as push it as a git tag for others.
