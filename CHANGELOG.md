# Changelog

## Unreleased

### Added

- Added the standard `formDisabledCallback()` to synchronize the component disabled state with disabled forms and fieldsets.

### Changed

- Updated component color defaults to use the shared semantic content and surface tokens.

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
