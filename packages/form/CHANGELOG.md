# 6.3.0 - Version bump to match Store@6.3.0

https://github.com/angular-redux/store/blob/master/CHANGELOG.md

# 6.2.0 - Version bump to match Store@6.2.0

https://github.com/angular-redux/store/blob/master/CHANGELOG.md

# 6.1.1 - Correct Peer Dependency

# 6.1.0 - Angular 4 Support, Toolchain Fixes

We now support versions 2 and 4 of Angular. However Angular 2 support is
deprecated and will be removed in a future major version.

Also updated the `npm` toolchain to build outputs on `npm publish` instead of
on `npm install`. This fixes a number of toolchain/installation bugs people
have reported.

# 6.0.0 - The big-rename.

Due to the impending release of Angular4, the name 'ng2-redux' no longer makes
a ton of sense.  The Angular folks have moved to a model where all versions are
just called 'Angular', and we should match that.

After discussion with the other maintainers, we decided that since we have to
rename things anyway, this is a good opportunity to collect ng2-redux and its
related libraries into a set of scoped packages. This will allow us to grow
the feature set in a coherent but decoupled way.

As of v6, the following packages are deprecated:

* ng2-redux
* ng2-redux-router
* ng2-redux-form

Those packages will still be available on npm for as long as they are being used.

However we have published the same code under a new package naming scheme:

* @angular-redux/store (formerly ng2-redux)
* @angular-redux/router (formerly ng2-redux-router)
* @angular-redux/form (formerly ng2-redux-form).

We have also decided that it's easier to reason about things if these packages
align at least on major versions. So everything has at this point been bumped
to 6.0.0.

# Breaking changes

Apart from the rename, the following API changes are noted:

* @angular-redux/store: none.
* @angular-redux/router: none.
* @angular-redux/form: `NgReduxForms` renamed to `NgReduxFormModule` for consistency.
