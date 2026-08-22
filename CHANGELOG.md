# Changelog

## [8.1.0] - 2026-08-22

### Changed

- Made custom-element module evaluation SSR-safe by extending `JBBaseComponent` where needed and registering elements through the shared `defineWebComponent()` helper; raised the minimum `jb-core` version to `0.35.0`.


### Fixed

- fix empty placeholder on multi-select

## [8.0.0] 2026-08-13

### Added

- Added the standard `formDisabledCallback()` to synchronize the component disabled state with disabled forms and fieldsets.
- Added independently built entry points for `jb-select/option` and `jb-select/option-list`, including `/web-component` and `/react` variants.
- Added the form-associated `jb-select/listbox` entry point with single and multiple selection, validation, keyboard navigation, and React support.

### Breaking changes

- `JBOptionWebComponent` and `JBOptionListWebComponent` are no longer registered or exported by the main `jb-select` entry point. Import each element independently wherever it is used:

  ```js
  import "jb-select";
  import "jb-select/option";
  import "jb-select/option-list";
  ```

  Update named imports in TypeScript in the same way:

  ```ts
  import { JBSelectWebComponent } from "jb-select";
  import { JBOptionWebComponent } from "jb-select/option";
  import { JBOptionListWebComponent } from "jb-select/option-list";
  ```

- `JBOption` and `JBOptionList` are no longer exported by `jb-select/react`. Import the React components independently:

  ```tsx
  import { JBSelect } from "jb-select/react";
  import { JBOption } from "jb-select/option/react";
  import { JBOptionList } from "jb-select/option-list/react";
  ```

### Changed

- Updated component color defaults to use the shared semantic content and surface tokens.
- Added checkbox-based listbox examples for both single and multiple selection.

## [7.4.3] 2026-07-27

### Fixed
- make clear button click non passive
- scroll to selected option when menu open

## [7.4.2] 2026-07-27

### Added

- Added Storybook interaction coverage for initial-value initialization, live-value precedence, explicit `null`, multiple selection, and native form reset.

### Changed

- Updated `initialValue` to seed `value` only until the live value is explicitly set; native form reset restores the latest initial value and re-enables initialization.
- Updated the React wrapper so an omitted `value` does not overwrite `initialValue`, while explicit `null` remains an explicit live value.

## [7.4.1] 2026-07-26

### Fixed

- add functionality for initial value so it also set value when value is not exist.

## [7.4.0] 2026-07-18

### Added

- Added the standard `formResetCallback()` to restore `initialValue` and clear validation state.

### Changed

- The option-list trigger now uses a native button and follows the select's disabled state.
- Select heights now inherit the shared `--jb-control-height-*` theme tokens for each size while preserving `--jb-select-height*` as the component-level override.
- Added the React `initialValue` prop and forwarded `value` and `initialValue` directly as React 19 custom-element properties.
- Breaking: renamed public CSS variables from `--jb-select-bgcolor*` to `--jb-select-bg-color*`.
- Breaking: renamed `--jb-select-mobile-input-bgcolor` to `--jb-select-mobile-input-bg-color`.
- Added public inline spacing, inline slot padding, list radius, and clear icon size variables.
- Forwarded the internal popover content as `popover-content` and standardized theme recipes on the select host plus exported parts.
- Removed redundant child theme-class hooks and refined Aurora popover elevation through the shared popover shadow API.

### Fixed

- fix clear button not reset selectedOptionList in multiple mode
