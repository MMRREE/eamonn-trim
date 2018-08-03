# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

# Versions
## Unreleased
2.0.0 - ????-??-??
### Added
- Spotify API function to callback and authenticate with the server
- Backend API transactions
- Spotify auto update token when it is close to running out of authentication

### Changed
- Spotify UI aligned like the rest of the website
- Spotify app with NavBar added to it
- Spotify app Playlist indexing and grid-area restructure
- Backend API calls instead of directly to Spotify (helps agaisnt CORS calls and better authentication flow)

## V1.1.0
1.1.0 - 2018-07-23
### Added
- index.css holding the styles for every page based on a defined class naming system
- Contact page
	+ "Email me" button added under comment input
- Backend data strucutre which contains
	+ Applications, an array of information about each applications (Name, Date, Description, Image)
	+ Designs, an array of information about each applications (Name, Date, Description, Image)
	+ Pages, an array of information about pages to index (Name)
- Routing algorithm to sort through backend data and provide correct routing for each page (based on pages, applications, designs)
- Applications
	+ Spotify
- Designs
	+ 3D Sin Wave
	+ Dots On Shape
	+ Factorial
	+ Snowfall
	+ Starfield

###  Changed
- Routing of pages now based on the backend data structure
- Home page style & layout
- Moved in-line styling to a global .css
- Contact Page
	+ Displays in the same new style as home
- Designs page
	+ Displays in same new style as home
	+ Displays a grid structure of Designs based on a backend data structure
- MostRecent page
	+ Renamed to "MostRecent"
	+ Sorts through backend data structure to find the latest date information to display that component
- Applications page
	+ Displays in same new style as home
	+ Displays a grid structure of Applications based on a backend data structure

### Fixed
- Contact page comment box local storage fetching and saving

## V1.0.0
1.0.0 - 2018-07-19
### Added
- This CHANGELOG file
- Absolute routing system to each page based on hard coded information
- Home page including an explaination of the website a background and defined styling
- MR (Most Recent) page (blank)
- Designs page (basic layout)
- Applications page (basic layout)

### Deprecated
- Contact page (comment box with local storage causing crash)
