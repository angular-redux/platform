# Contributing to Angular Redux

## Package Management

This repo utilizes [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) for package management. Please install and use [Yarn](https://yarnpkg.com/en/docs/getting-started) as your npm client for this project. The npm cli is not supported for package installation.

## Commit Message Guidelines

We follow the [Conventional Commits](https://conventionalcommits.org/) guidelines. These are enforced through the use of [commitlint](http://marionebl.github.io/commitlint). If you would like a more interactive way of formatting your commit messages, run `yarn commit` once your changes are staged.

## Releases

## Canary Releases

This repo is setup to automatically release canary builds for every commit that is pushed to master. In order to access those builds, run `npm install @angular-redux/store@next` (or whichever package you are looking to use)

## Stable Releases

For stable releases, the build and publishing is done automatically for CircleCI. If you have write access to the repo, run the following steps to automatically release a new version to `latest`

- Pull down the latest version of master to your local machine
- Run `yarn release:stable`

The release commit will be automatically pushed to `master` where CircleCI will complete the remaining publishing steps.
