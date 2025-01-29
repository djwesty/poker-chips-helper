# Project Structure
Poker chips helper is primarily a single page mobile application. With the suggested patterns of React Native and Expo in mind, here is a basic idea of project structure to allow the work of multiple team members in parallel. These categories will roughly correspond to directories in the application source tree, and the items will roughly correspond to source files which encapsulate a react component or other module. This document will be updated to add precision.

## Components (re-usable react modules)


* Simple number picker: a re-usable increment/decrement number picker
* Regular number picker: a re-usable free form/keyboard number picker
* Re-usable styled output result display

## Containers (stateful implementations of components)

* Number of players picker component
* Buy-in amount picker component
* Number of chip colors picker component
* Count of chips picker component
* Image recognition input component
* Quick save / Quick load component 


## API
* Abstraction to call image recognition API

## Assets
* Graphics, fonts, etc.

## Styles
* Global styles

## App
* Main application component, which implements all containers

## Tests
* Tests may exist either along side the corresponding source files, or in a seperate directory here.