# electron-redmine
A redmine desktop client made with electron 

## Object & Scope
This project was intended to help our team to track the time spent on every daily activity. 
We've realized that when our dev-team have lots of parallel activities they usually loose track of the time spent on every task.

Basically this project only helps you start, pause, and finish, the activities delegated to you on redmine while tracking the time spent on then. 

This project also has the objective to track the resources edited during every task so its easy to commit on the central repository (yeah, we don't use git and our process doesn't help either)

This project was also created as a training of development using electron and vue.

The scope of this project doesn't include integragion with any version control system. 

## Target Audience

If your team uses redmine, Your projects usually have lots of activities too be executed im parallel with priorities changing frequently, maybe it helps you.

## Thecnology Requirements / API

Node.js,
electron and electron-builder
A desktop,
A redmine server running with rest api enabled.

## Budget

One developer working on his free-time. Basically up to 1.5 hours per-day.
A server running redmine instance

## Deployment

- Install [Node.js](https://nodejs.org/) tools
- Checkout the project from this repository;
```sh
  $ git clone git://github.com/warnoleto/electron-redmine.git
```
- Run it on development enviroment:
```sh
  $ cd electron-redmine
  $ npm install
  $ npm run dev
```
- Build a production the installer (win32):
```sh
  $ npm run build
```
