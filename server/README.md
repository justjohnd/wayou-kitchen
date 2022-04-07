#Welcome to veggit!
Here are some helpful notes on development and deployment of this site.

## Deployment and Git

Note that there are two seperate git repositories currently set up for the site. The repo in the project directory is used for GitHub, while the repo inside `/server` is specifically used for pushing to heroku.

The `/client` directory in the main project directory is used to store the `/build`.

- From the `/server` directory, enter `heroku login`. The browser will open. Click the Login button.
- Make any git commits.
- Enter `git push heroku master`
