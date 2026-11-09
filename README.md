# a11y-ui-kit

**An accessible React component library built with Radix UI, TypeScript, and Storybook.**

a11y-ui-kit is a personal project focused on building reusable, accessible UI components with an emphasis on keyboard navigation, focus management, semantic HTML, and ARIA.

The goal is to explore how accessibility principles can be translated into practical component APIs, reusable styles, and testable user interactions.

**Project status:** In development.

## Overview

The project demonstrates how to build, test, and document accessible React components using Radix UI primitives and modern frontend tooling.

Current focus areas:

- Accessible component APIs and reusable UI patterns.
- Keyboard navigation and interaction states.
- Focus management and visible focus indicators.
- Semantic HTML and appropriate ARIA attributes.
- Reduced-motion preferences.
- Component documentation and interaction testing.

## Tech Stack

| Technology      | Purpose                                            |
| --------------- | -------------------------------------------------- |
| React 19        | UI development                                     |
| TypeScript      | Static typing                                      |
| Vite            | Development server and production builds           |
| Radix UI        | Accessible component primitives                    |
| CSS Modules     | Component-level styling                            |
| Storybook 10    | Component documentation and isolated development   |
| Vitest          | Automated testing                                  |
| Playwright      | Browser-based testing                              |
| Testing Library | Component interaction testing                      |
| Oxlint          | Code linting                                       |
| Prettier        | Code formatting                                    |
| GitHub Actions  | Continuous integration and GitHub Pages deployment |

## Components

The library is being developed incrementally. The table below distinguishes implemented components from planned work.

| Component   | Status      | Features                                                     |
| ----------- | ----------- | ------------------------------------------------------------ |
| Button      | Implemented | Variants, sizes, disabled and loading states                 |
| Dialog      | Implemented | Modal interaction, focus management, keyboard dismissal      |
| Tabs        | Implemented | Keyboard-accessible tab navigation (WAI-ARIA tabs pattern)   |
| Tooltip     | Implemented | Accessible contextual information, dismissible and hoverable |
| TextField   | Implemented | Required label, description, announced error                 |
| Checkbox    | Planned     | Accessible selection control                                 |
| Switch      | Planned     | Accessible toggle control                                    |
| AlertDialog | Planned     | Confirmation of important actions                            |

### Button

A reusable button component with multiple visual variants and sizes.

**Variants:**

- `primary`
- `secondary`
- `outline`
- `danger`

**Sizes:**

- `sm`
- `md`
- `lg`

**Supported states:**

- Default
- Disabled
- Loading
- ARIA-disabled

The loading state keeps the button in the keyboard focus order while preventing interaction.

Example:

```tsx
import { Button } from "./components/Button";

function Example() {
  return (
    <>
      <Button variant="primary">Save changes</Button>

      <Button variant="secondary">Cancel</Button>

      <Button variant="danger">Delete</Button>
    </>
  );
}
```

### Dialog

A modal dialog built on top of `@radix-ui/react-dialog`.

**Features:**

- Accessible title and description.
- Keyboard interaction.
- Focus management.
- Focus containment while open.
- Escape key dismissal.
- Focus restoration to the trigger.
- Reduced-motion support.
- Customizable content and footer.

Example:

```tsx
import { Button } from "./components/Button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./components/Dialog";

function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Save changes?</DialogTitle>

        <DialogDescription>You have unsaved changes.</DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="primary">Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Tabs

Accessible tabs built on top of `@radix-ui/react-tabs` and the WAI-ARIA tabs pattern.

**Features:**

- `tablist`, `tab`, and `tabpanel` roles with accessible names.
- Roving tabindex: only the active tab is in the Tab order.
- Arrow keys switch tabs; `Home` and `End` jump to the first and last tab.
- `Tab` moves focus from the tab list into the open panel.
- The tab list requires an accessible name: pass `aria-label` or `aria-labelledby`. The type system rejects a list without one.

Example:

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/Tabs";

function Example() {
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Project details">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">General information.</TabsContent>
      <TabsContent value="activity">Latest changes.</TabsContent>
    </Tabs>
  );
}
```

### Tooltip

A tooltip built on top of `@radix-ui/react-tooltip`.

**Features:**

- Opens on keyboard focus and on hover.
- Dismissible with `Escape` without moving focus. Inside a Dialog the first `Escape` closes only the tooltip.
- Stays open while the pointer is over the tooltip itself.
- Describes the trigger through `aria-describedby`.
- Works on a button with `aria-disabled`, so the reason an action is unavailable can be explained to keyboard users. A button with the `disabled` attribute cannot receive focus and cannot show a tooltip.

**Limitation:** a tooltip does not open on touch screens. Do not put information in it that is required to use the interface. Do not repeat the trigger's `aria-label` in the tooltip text, because the name would be announced twice.

Wrap the application once in `TooltipProvider`:

```tsx
import { Button } from "./components/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/Tooltip";

function Example() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Export</Button>
        </TooltipTrigger>

        <TooltipContent>CSV file, up to 10 MB</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

### TextField

A text input with a required visible label.

**Features:**

- The `label` prop is required. A placeholder does not replace it.
- Optional `description` and `error` texts are linked to the input through `aria-describedby`, merged with any value you pass yourself.
- The input gets `aria-invalid` while an error is shown.
- The error is rendered in an always-mounted `aria-live="polite"` region, so a screen reader announces it when it appears.
- All standard `input` props are passed through, including `ref`.

Example:

```tsx
import { useState } from "react";

import { TextField } from "./components/TextField";

function Example() {
  const [value, setValue] = useState("");

  return (
    <TextField
      label="Email"
      description="We will send a sign-in link to this address."
      type="email"
      required
      value={value}
      error={
        value.includes("@") ? "" : "Enter an address like name@example.com."
      }
      onChange={(event) => {
        setValue(event.target.value);
      }}
    />
  );
}
```

## Accessibility

Accessibility is a central design consideration throughout the project.

The implementation and development goals include:

- Semantic HTML elements.
- Appropriate ARIA attributes and accessible names.
- Keyboard-operable controls.
- Visible focus indicators.
- Predictable focus management.
- Support for `prefers-reduced-motion`.
- Accessible loading and disabled states.
- Meaningful status announcements where needed.

The project uses Radix UI primitives to provide accessible interaction patterns while keeping component styling and APIs under custom implementation.

**Accessibility target: WCAG 2.2 Level AA.**

This is a development target, not a claim of certified or fully verified WCAG conformance. Automated testing covers only part of accessibility. Manual keyboard, screen reader, contrast, and browser checks are also necessary.

## Why Radix UI instead of MUI?

Radix UI was chosen because the project focuses on accessible component implementation, API design, and custom styling.

- **Accessible primitives:** Radix UI provides interaction patterns such as focus management and keyboard handling for supported components.
- **Custom styling:** Unstyled primitives make it possible to build a custom visual design using CSS Modules and shared design tokens.
- **Component API design:** The project explores how reusable components can expose flexible APIs without sacrificing accessibility.
- **Trade-offs:** Radix UI does not provide a complete visual design system. Component styling, contrast, accessible names, and appropriate content remain important responsibilities.

MUI is also a strong choice for applications that benefit from a comprehensive, ready-made component system. This project prioritizes learning how accessible components are assembled and customized.

## Testing

The project uses Vitest, Testing Library, and Storybook-based browser testing.

| Tool                          | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| Vitest                        | Running automated tests                          |
| Testing Library               | Testing component behavior and user interactions |
| Playwright                    | Browser-based testing with Chromium              |
| Storybook                     | Isolated component development and documentation |
| Storybook accessibility addon | Identifying potential accessibility violations   |

Storybook stories can include interaction tests using `play` functions to verify keyboard behavior, focus management, and component states.

### Available commands

Run all automated tests:

```bash
pnpm test
```

Run unit tests only:

```bash
pnpm test:unit
```

Run Storybook browser tests only:

```bash
pnpm test:storybook
```

Generate unit test coverage:

```bash
pnpm test:coverage
```

Run the production build:

```bash
pnpm build
```

Build Storybook:

```bash
pnpm build-storybook
```

Run linting:

```bash
pnpm lint
```

Run TypeScript checks:

```bash
pnpm typecheck
```

Check formatting:

```bash
pnpm format:check
```

The availability of individual commands depends on the corresponding scripts in `package.json`.

## Verification Status

### Automated checks

The project includes automated tests and build checks for component behavior and code quality.

The verification workflow covers:

- Unit and interaction tests.
- Keyboard interaction and focus behavior.
- Storybook browser tests.
- Accessibility checks through the Storybook accessibility addon. Violations fail the Storybook test run (`a11y.test: "error"` in `.storybook/preview.tsx`). axe runs after the `play` function, so a dialog has to be open at the end of a story to be checked, which is what `Dialog › Open` does.
- TypeScript checks.
- Production builds.
- Linting and formatting.
- A continuous integration workflow that runs these checks on every push to `main` and on pull requests (see [Continuous integration](#continuous-integration)).

Automated accessibility checks can identify some common issues, but passing them does not establish full accessibility conformance.

### Remaining verification work

The following areas require additional verification or documentation:

- Manual screen reader testing, including NVDA.
- Testing with additional screen reader and browser combinations.
- Dark theme support, which is not yet implemented.
- Windows high-contrast and `forced-colors` mode. CSS rules exist for Tabs, Dialog, and Tooltip, but they have not been checked on a real Windows high-contrast theme.
- Manual verification of applicable WCAG 2.2 criteria.
- Documentation of accessibility testing results in `docs/`.

## Getting Started

### Requirements

- Node.js 24 (pinned in `.nvmrc`) or another version allowed by `engines` in `package.json`.
- pnpm, using the version specified in `package.json` under `packageManager`. Use pnpm only: do not run `npm install` in this project.

### Installation

Clone the repository (copy its URL from the **Code** button on GitHub) and navigate to the project directory:

```bash
cd a11y-ui-kit
```

Install dependencies:

```bash
pnpm install
```

Install the Chromium build used by the Storybook browser tests:

```bash
pnpm exec playwright install chromium
```

### Development

Start the Vite development server:

```bash
pnpm dev
```

### Storybook

Start Storybook:

```bash
pnpm storybook
```

Open the local Storybook instance at:

`http://localhost:6006`

### Production Build

Build the application:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

Build Storybook:

```bash
pnpm build-storybook
```

### Code Quality

Run Oxlint:

```bash
pnpm lint
```

Run TypeScript checks:

```bash
pnpm typecheck
```

Check formatting:

```bash
pnpm format:check
```

## Continuous Integration

Two GitHub Actions workflows live in `.github/workflows/`:

- `ci.yml` runs on pushes to `main` and on pull requests: `pnpm install --frozen-lockfile`, lint, type check, formatting check, all tests (with Chromium installed through Playwright), the application build, and the Storybook build.
- `pages.yml` publishes the demo application at the site root and Storybook under `/storybook/` on GitHub Pages. It runs after a successful `CI` run on `main`, or manually.

Before the first deployment enable Pages in the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**. The published address is shown in the workflow run and under **Environments → github-pages**.

The workflows assume that the default branch is `main` and that the site is served from `https://<owner>.github.io/<repository>/`. For a custom domain, adjust `VITE_BASE` and `VITE_STORYBOOK_URL` in `pages.yml`.

## Project Structure

```text
a11y-ui-kit/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── pages.yml
├── .storybook/
│   ├── main.ts
│   ├── manager.ts
│   └── preview.tsx
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.module.css
│   │   │   ├── Button.stories.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.tsx
│   │   ├── Dialog/
│   │   │   ├── Dialog.module.css
│   │   │   ├── Dialog.stories.tsx
│   │   │   └── index.tsx
│   │   ├── Tabs/
│   │   │   ├── Tabs.module.css
│   │   │   ├── Tabs.stories.tsx
│   │   │   ├── Tabs.test.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── index.ts
│   │   ├── TextField/
│   │   │   ├── TextField.module.css
│   │   │   ├── TextField.stories.tsx
│   │   │   ├── TextField.test.tsx
│   │   │   ├── TextField.tsx
│   │   │   └── index.ts
│   │   └── Tooltip/
│   │       ├── Tooltip.module.css
│   │       ├── Tooltip.stories.tsx
│   │       ├── Tooltip.test.tsx
│   │       ├── Tooltip.tsx
│   │       └── index.ts
│   ├── docs/
│   │   └── Introduction.mdx
│   ├── styles/
│   │   └── tokens.css
│   ├── test/
│   │   └── setup.ts
│   ├── utils/
│   │   └── cx.ts
│   ├── App.module.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .gitattributes
├── .gitignore
├── .nvmrc
├── .oxlintrc.json
├── .prettierignore
├── LICENSE
├── README.md
├── index.html
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.shims.d.ts
```

## Roadmap

The roadmap tracks implemented functionality and planned improvements.

### Completed

- [x] Set up React, TypeScript, and Vite.
- [x] Integrate Radix UI primitives.
- [x] Implement the Button component with variants, sizes, and interaction states.
- [x] Implement the Dialog component with keyboard interaction and focus management.
- [x] Implement accessible Tabs.
- [x] Implement Tooltip.
- [x] Implement TextField.
- [x] Add component stories to Storybook.
- [x] Introduce shared design tokens.
- [x] Add automated component tests.
- [x] Configure Storybook and browser testing tools.
- [x] Configure a GitHub Actions CI workflow.
- [x] Expand keyboard interaction and accessibility tests.

### In progress / Planned

- [ ] Complete the Checkbox component.
- [ ] Complete the Switch component.
- [ ] Add AlertDialog for destructive actions.
- [ ] Add light and dark themes.
- [ ] Improve accessibility documentation.
- [ ] Add manual screen reader testing notes.
- [ ] Verify Windows high-contrast mode.
- [ ] Publish Storybook documentation (the workflow is ready; enable GitHub Pages).

## Links

- **GitHub Repository:** To be added.
- **Live Storybook:** To be added. It will be published to GitHub Pages by `pages.yml` (see [Continuous Integration](#continuous-integration)).

## License

[MIT](LICENSE)

## Author

Created as a personal project to explore the intersection of frontend engineering, UI development, and digital accessibility.

---

**a11y-ui-kit — Building interfaces that work for everyone.**
