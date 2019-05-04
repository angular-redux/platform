# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0](https://github.com/angular-redux/platform/compare/v9.0.1...v10.0.0) (2019-05-04)

### chore

- **build:** use ng-packagr ([#37](https://github.com/angular-redux/platform/issues/37)) ([dffe23a](https://github.com/angular-redux/platform/commit/dffe23a)), closes [#9](https://github.com/angular-redux/platform/issues/9)
- **linting:** add global tslint rules ([#35](https://github.com/angular-redux/platform/issues/35)) ([336cc60](https://github.com/angular-redux/platform/commit/336cc60)), closes [#4](https://github.com/angular-redux/platform/issues/4)

### Features

- upgrade to angular 7 ([#72](https://github.com/angular-redux/platform/issues/72)) ([18d9245](https://github.com/angular-redux/platform/commit/18d9245)), closes [#65](https://github.com/angular-redux/platform/issues/65) [#66](https://github.com/angular-redux/platform/issues/66) [#67](https://github.com/angular-redux/platform/issues/67) [#68](https://github.com/angular-redux/platform/issues/68) [#69](https://github.com/angular-redux/platform/issues/69) [#70](https://github.com/angular-redux/platform/issues/70) [#71](https://github.com/angular-redux/platform/issues/71) [#74](https://github.com/angular-redux/platform/issues/74) [#79](https://github.com/angular-redux/platform/issues/79)

### BREAKING CHANGES

- Upgrades Angular dependencies to v7
- **build:** - changes the output to conform to the Angular Package Format. This may cause subtle differences in consumption behaviour

* peer dependencies have been corrected to actual dependencies

- **linting:** - ConnectArray has been renamed to ConnectArrayDirective

* ReactiveConnect has been renamed to ReactiveConnectDirective
* Connect has been renamed to ConnectDirective
* interfaces with an "I" prefix have had that prefix removed (e.g "IAppStore" -> "AppStore")

# 9.0.0 - Angular 6, RxJS 6 Support

Adapts to breaking changes in Angular 6 and RxJS 6. Also updates to Typescript 2.7.2.

# 7.0.0 - Angular 5+ only support

- Update to Angular 5 compiler
- Update RxJS, change to use let-able operators
- Requires @angular-redux/store 7+

** Breaking Change **

- NgReduxRouterModule now needs to be imported with `.forRoot`

**before**

```ts
@NgModule({
  declarations: [AppComponent],
  imports: [
    RouterModule.forRoot(appRoutes),
    /* .... */
    NgReduxRouterModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

**after**

```ts
@NgModule({
  declarations: [AppComponent],
  imports: [
    RouterModule.forRoot(appRoutes),
    /* .... */
    NgReduxRouterModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

# 6.4.0 - Angular 5 Support

Added support for Angular 5.

# 6.3.1 - Toolchain Update

- Typescript 2.4.1
- Compile with `strict: true` in tsconfig.json
- Fix for issue #17.
- Add package-lock.json for contributors using npm 5+.

# 6.3.0 - Version bump to match Store@6.3.0

https://github.com/angular-redux/store/blob/master/CHANGELOG.md

# 6.2.0 - Version bump to match Store@6.2.0

https://github.com/angular-redux/store/blob/master/CHANGELOG.md

# 6.1.0 - Angular 4 Support

We now support versions 2 and 4 of Angular. Version 2 support is deprecated and
support will be removed in the next major version.

# 6.0.1

- Include the `src`-folder in the release so webpack can build source maps.

# 6.0.0 - The big-rename.

Due to the impending release of Angular4, the name 'ng2-redux' no longer makes a
ton of sense. The Angular folks have moved to a model where all versions are
just called 'Angular', and we should match that.

After discussion with the other maintainers, we decided that since we have to
rename things anyway, this is a good opportunity to collect ng2-redux and its
related libraries into a set of scoped packages. This will allow us to grow the
feature set in a coherent but decoupled way.

As of v6, the following packages are deprecated:

- ng2-redux
- ng2-redux-router
- ng2-redux-form

Those packages will still be available on npm for as long as they are being
used.

However we have published the same code under a new package naming scheme:

- @angular-redux/store (formerly ng2-redux)
- @angular-redux/router (formerly ng2-redux-router)
- @angular-redux/form (formerly ng2-redux-form).

We have also decided that it's easier to reason about things if these packages
align at least on major versions. So everything has at this point been bumped to
6.0.0.

# Breaking changes

Apart from the rename, the following API changes are noted:

- @angular-redux/store: none.
- @angular-redux/router: none.
- @angular-redux/form: `NgReduxForms` renamed to `NgReduxFormModule` for
  consistency.
