[![Netlify Status](https://api.netlify.com/api/v1/badges/2421c10f-be2e-402e-bf63-b200c1fdd750/deploy-status)](https://app.netlify.com/sites/determined-ui-kit/deploys)

# Determined-UI

Determined-UI is a UI kit containing useful react components and common styles
for products by determined.ai.

## Live preview

[https://determined-ui-kit.netlify.app/]

## How to use

We're currently unpublished while we set up an NPM organization, so install from
the github repo like this:

```bash
npm install https://git@github.com/determined-ai/determined-ui.git
```

Components are exported both at the top level module and as individual modules:

```tsx
import { Avatar } from 'determined-ui';
import Card from 'determined-ui/Card';
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

## Working between determined-ui and another repo

Sometimes, you'll have to update determined-ui as an upstream change to another repo, like determined. Here's how to handle that process:

- When you're working locally and want to check your ui kit changes in your other repo:
  - make sure you're using the same version of node between determined-ui and your other repo
  - run `npm link` in the determined-ui repo folder
  - run `npm link determined-ui` in the other repo's folder
  - - remember to run `npm unlink determined-ui` when you're done!
- When committing changes to the other repo downstream of unmerged changes in the UIKit
  - install the ui kit such that it matches the branch you're working on with `npm install https://git@github.com/determined-ai/determined-ui.git#<BRANCH_NAME_HERE>` and commit the package.lock
  - repeat the above as new changes come from your upstream
  - - remember to switch back to a tagged version when your upstream changes are merged with `npm install https://git@github.com/determined-ai/determined-ui.git#<VERSION_NUMBER_HERE>`
