# Todo List (PWA)

## Demo

https://umer2001-todo-pwa.netlify.app/

## Features

- Cross platform (PWA)
- Offline Capabilities (PWA)
- User Auth
- Different Themes
- Automated Backend setup
- Dockerized
- Android feel

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`REACT_APP_ENVIRONMENT` development/production

`FAUNA_DB_SECRET` DB secret, obtained manually or by setup script

`JWT_SECRET` Any String example : hello_world, abcd, etc

`REACT_APP_MODE` guest/normal

If you set `REACT_APP_MODE=guest` then you also have to add environment variables listed below :

`REACT_APP_GUEST_EMAIL` email address for guest account, obtained manually or by setup script

`REACT_APP_GUEST_PASSWORD` password for guest account, obtained manually or by setup script
