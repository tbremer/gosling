# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [Releases]

## [3.0.0] - 2016-11-17
### Added
- Support for adding multiple thunks to a statement
  - IE: `app.use('/', thunk, thunk, thunk)`
- Added comments to a lot of the code based
- Reorganized code so `index.js` is only the basic code, and `utils.js` contains all of our additional functions
- Added tests for outlier functionality.
- Modified error messages to be more specific to the problem that occurred.

## [2.0.0] - 2016-11-11
### Added
- Support for `response.end()`. When this is called we stop executing middleware to avoid additional writes to the client.

## [1.1.0] - 2016-07-11
### Added
- HTTPS support

*this changelog entry has been backfilled based on git logs,and may be inaccurate*

## [1.0.1] - 2016-07-08
### Fixed
- Performance and Bugs

*this changelog entry has been backfilled based on git logs,and may be inaccurate*

## [1.0.0] - 2016-07-08
### Added
- Initial release
