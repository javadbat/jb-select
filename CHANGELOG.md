# Changelog

## Unreleased

### Added

- Added the standard `formResetCallback()` to restore `initialValue` and clear validation state.

### Changed

- Added the React `initialValue` prop and forwarded `value` and `initialValue` directly as React 19 custom-element properties.
- Breaking: renamed public CSS variables from `--jb-select-bgcolor*` to `--jb-select-bg-color*`.
- Breaking: renamed `--jb-select-mobile-input-bgcolor` to `--jb-select-mobile-input-bg-color`.
- Added public inline spacing, inline slot padding, list radius, and clear icon size variables.
- Forwarded the internal popover content as `popover-content` and standardized theme recipes on the select host plus exported parts.
- Removed redundant child theme-class hooks and refined Aurora popover elevation through the shared popover shadow API.
