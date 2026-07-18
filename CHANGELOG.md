# Changelog

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