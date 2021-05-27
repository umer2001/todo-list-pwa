#!/bin/bash

RED="\e[31m"
GREEN="\e[32m"
BLUE="\e[94m"
YELLOW="\e[33m"
PURPLE="\e[35m"
SEE_GREEN="\e[96m"
ENDCOLOR="\e[0m"

configuration_file_path=$HOME/.fauna-shell
netlify_config_file_path=$HOME/AppData/Roaming/netlify/Config/config.json

graphql_file_path=fauna/todos.gql
# TODO: decide if the user will give or defaul values will be used
environment=development
jwt_secret=todo_task
app_mode=guest
guest_email=guest@gmail.com
guest_name=Guest
guest_password=12345

echo "Welcome"
echo -e "${BLUE}what do you want to do ?${ENDCOLOR}"
echo -e "${SEE_GREEN}[1] initial setup"
echo -e "[2] start local dev server${ENDCOLOR}"

read ans

if [[ ( $ans == 1 ) ]]
then
        echo -e "${RED}Fauna-shell doesnot support login with Github or Netlify at the moment${ENDCOLOR}\n${YELLOW}Make sure you have an fauna db accound made with email and password.${ENDCOLOR}"

        npm install
        if ! command -v fauna &> /dev/null
        then
          echo -e "${YELLOW}installing fauna shell...${ENDCOLOR}"
          npm install -g fauna-shell
        fi

        if ! test -f $configuration_file_path;
        then
          echo -e "${BLUE}Login to fauna${ENDCOLOR}"
          fauna cloud-login
        fi

        echo -e "${BLUE}database name : ${ENDCOLOR}"
        read db_name
        echo -e "${YELLOW}creating a database named $db_name${ENDCOLOR}"
        fauna create-database $db_name
        echo -e "${YELLOW}creating a key for $db_name${ENDCOLOR}"
        fauna_db_key_string=$(fauna create-key $db_name)

        fauna_db_key=$(echo $fauna_db_key_string | cut -d ':' -f 2)
        fauna_db_key=$(echo $fauna_db_key | cut -d " " -f 1)
        fauna_db_key=$(echo $fauna_db_key | cut -d "'" -f 1)

        echo -e "${YELLOW}creating .env file...${ENDCOLOR}"
        #asking user for environment variables
        echo -e "environment ${BLUE}development/production${ENDCOLOR} ${SEE_GREEN}default : $environment${ENDCOLOR}"
        read ans
        if [[ $ans != "" ]]
        then
          environment=$ans
        fi
        echo -e "JWT secret ${BLUE}(any)${ENDCOLOR} ${SEE_GREEN}default : $jwt_secret${ENDCOLOR}"
        read ans
        if [[ $ans != "" ]]
        then
          jwt_secret=$ans
        fi
        echo -e "App mode ${BLUE}guest/normal${ENDCOLOR} ${SEE_GREEN}default : $app_mode${ENDCOLOR}"
        read ans
        if [[ $ans == "" ]]
        then
          echo -e "guest account email ${BLUE}(any)${ENDCOLOR} ${SEE_GREEN}default : $guest_email${ENDCOLOR}"
          read ans
          if [[ $ans != "" ]]
          then
            guest_email=$ans
          fi
          echo -e "guest account password ${BLUE}(any)${ENDCOLOR} ${SEE_GREEN}default : $guest_password${ENDCOLOR}"
          read ans
          if [[ $ans != "" ]]
          then
            guest_password=$ans
          fi
        fi

        echo -e ''${YELLOW}'REACT_APP_ENVIRONMENT'${ENDCOLOR}'='${GREEN}$environment''
        echo -e ''${YELLOW}'JWT_SECRET'${ENDCOLOR}'='${GREEN}$jwt_secret''
        echo -e ''${YELLOW}'REACT_APP_MODE'${ENDCOLOR}'='${GREEN}$app_mode''
        echo -e ''${YELLOW}'REACT_APP_GUEST_EMAIL'${ENDCOLOR}'='${GREEN}$guest_email''
        echo -e ''${YELLOW}'REACT_APP_GUEST_PASSWORD'${ENDCOLOR}'='${GREEN}$guest_password''
        echo -e ''${YELLOW}'FAUNA_DB_SECRET'${ENDCOLOR}'='${GREEN}$fauna_db_key${ENDCOLOR}''

        echo 'REACT_APP_ENVIRONMENT='$environment'' >> .env
        echo 'JWT_SECRET='$jwt_secret'' >> .env
        echo 'REACT_APP_MODE='$app_mode'' >> .env
        echo 'REACT_APP_GUEST_EMAIL='$guest_email'' >> .env
        echo 'REACT_APP_GUEST_PASSWORD='$guest_password'' >> .env
        echo 'FAUNA_DB_SECRET='$fauna_db_key'' >> .env

        echo 'FAUNA_KEY='$fauna_db_key'' >> .faunarc

        echo -e "${YELLOW}importing functions into database...${ENDCOLOR}"
        node ./fauna/faunaFunctionsSetup.js

        if ! test -f $graphql_file_path;
        then
          echo -e "${BLUE}enter grapgql schema path (without first ./)${ENDCOLOR}"
          read path
          echo -e "${YELLOW}importing schema into database...${ENDCOLOR}"
          curl -u $fauna_db_key: https://graphql.fauna.com/import --data-binary "@$path"
        fi

        echo -e "${YELLOW}importing schema into database...${ENDCOLOR}"
        curl -u $fauna_db_key: https://graphql.fauna.com/import --data-binary "@$graphql_file_path"


        echo -e "${YELLOW}creating guest user account....${ENDCOLOR}"
        echo "const bcrypt = require('bcrypt');require('dotenv').config();(async (password) => {const salt = await bcrypt.genSalt(10);const hash = await bcrypt.hash(password, salt);console.log(hash);})('$guest_password');" >> hash.js
        hashed_password=node hash.js
        rm hash.js

        curl -u $fauna_db_key: https://graphql.fauna.com/graphql \
        -d '{"query":"mutation \n{\n  createUser(data: {\n    name: \"'$guest_name'\"\n    email: \"'$guest_email'\"\n    password: \"'$hashed_password'\"\n  }) {\n    email\n    password\n  }\n}"}'

        #make env till this point

        echo -e "${BLUE}Do you want to start local dev server [y/n]?${ENDCOLOR}"
        read ans
        if [[ ( $ans -eq "y" || $ans  -eq "Y" ) ]]
        then
          echo -e "${YELLOW}starting local dev server...${ENDCOLOR}"
          netlify dev
        fi

elif [ $ans == 2 ]
then
        echo -e "${YELLOW}starting local dev server...${ENDCOLOR}"
        if ! command -v netlify &> /dev/null
        then
          echo -e "${YELLOW}installing netlify cli...${ENDCOLOR}"
          npm install -g netlify-cli
        fi
      netlify dev
fi

