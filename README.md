# Budget Tracker

## Description

Add functionality to our existing Budget Tracker application to allow for offline access and functionality.

The user will be able to add expenses and deposits to their budget with or without a connection. When entering transactions offline, they should populate the total when brought back online.

Offline Functionality:

- Enter deposits offline

- Enter expenses offline

When brought back online:

- Offline entries should be added to tracker.

## Table of Contents

- [User Story](#user-story)
- [Acceptance Criteria](#acceptance-criteria)
- [Usage](#usage)
- [Technologies](#technologies)
- [Credits](#credits)

## User Story

AS AN avid traveller

I WANT to be able to track my withdrawals and deposits with or without a data/internet connection

SO THAT my account balance is accurate when I am traveling

## Acceptance Criteria

GIVEN a user is on Budget App without an internet connection

WHEN the user inputs a withdrawal or deposit

THEN that will be shown on the page, and added to their transaction history when their connection is back online.

## Usage

### If Local:

- npm start to start the server.
- navigate to (http://localhost:3000/)

### From Heroku:

https://cryptic-depths-27411.herokuapp.com/

## Technologies

- [NodeJS](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- PWA Processes:
  - indexedDB
  - Offline caching via service workers
