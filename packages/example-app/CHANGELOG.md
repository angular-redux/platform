# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0](https://github.com/angular-redux/platform/compare/v9.0.1...v10.0.0) (2019-05-04)

### chore

- **linting:** add global tslint rules ([#35](https://github.com/angular-redux/platform/issues/35)) ([336cc60](https://github.com/angular-redux/platform/commit/336cc60)), closes [#4](https://github.com/angular-redux/platform/issues/4)

### Features

- upgrade to angular 7 ([#72](https://github.com/angular-redux/platform/issues/72)) ([18d9245](https://github.com/angular-redux/platform/commit/18d9245)), closes [#65](https://github.com/angular-redux/platform/issues/65) [#66](https://github.com/angular-redux/platform/issues/66) [#67](https://github.com/angular-redux/platform/issues/67) [#68](https://github.com/angular-redux/platform/issues/68) [#69](https://github.com/angular-redux/platform/issues/69) [#70](https://github.com/angular-redux/platform/issues/70) [#71](https://github.com/angular-redux/platform/issues/71) [#74](https://github.com/angular-redux/platform/issues/74) [#79](https://github.com/angular-redux/platform/issues/79)

### BREAKING CHANGES

- Upgrades Angular dependencies to v7
- **linting:** - ConnectArray has been renamed to ConnectArrayDirective

* ReactiveConnect has been renamed to ReactiveConnectDirective
* Connect has been renamed to ConnectDirective
* interfaces with an "I" prefix have had that prefix removed (e.g "IAppStore" -> "AppStore")
