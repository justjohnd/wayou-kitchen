# Welcome to veggit!

Here are some helpful notes on development and deployment of this site.

To open your developer environment:

- Navigate to `server/client` and run `npm start`
- Connect to the server by navigating to `server` directory and running `node nodemon.js`

## Misc. Notes

- The routing is contained in `client/src/App.js`
- Currently userId is being stored in local storage
- Reset password is not connected yet

## Deployment and Git

Note that there are two seperate git repositories currently set up for the site. The repo in the project directory is used for GitHub, while the repo inside `/server` is specifically used for pushing to heroku.

The `/client` directory in the main project directory is used to store the `/build`.

- From the `/server/client` directory run `npm run build`
- From the `/server` directory, enter `heroku login`. The browser will open. Click the Login button.
- Make any git commits.
- Enter `git push heroku master`

## MongoDB cheatsheet

These commands can be used when conntecting via MongoDB shell:

- `show dbs`
- `show collections`
- `db.<collection name>.find()`
- `db.<collection name>.find({<keyname>:<value>})`
