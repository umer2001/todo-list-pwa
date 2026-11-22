#!/bin/bash
set -e

RED="\e[31m"
GREEN="\e[32m"
BLUE="\e[94m"
YELLOW="\e[33m"
SEE_GREEN="\e[96m"
ENDCOLOR="\e[0m"

environment=development
jwt_secret=todo_task
app_mode=guest
guest_email=guest@gmail.com
guest_password=12345

echo "Welcome"
echo -e "${BLUE}What do you want to do?${ENDCOLOR}"
echo -e "${SEE_GREEN}[1] Initial setup (Neon + .env + schema migration)"
echo -e "[2] Start local dev server${ENDCOLOR}"

read ans

if [[ "$ans" == "1" ]]; then
  npm install

  echo -e "${BLUE}Enter your Neon DATABASE_URL connection string:${ENDCOLOR}"
  read database_url
  if [[ -z "$database_url" ]]; then
    echo -e "${RED}DATABASE_URL is required.${ENDCOLOR}"
    exit 1
  fi

  echo -e "Environment ${BLUE}development/production${ENDCOLOR} ${SEE_GREEN}default : $environment${ENDCOLOR}"
  read input
  [[ -n "$input" ]] && environment="$input"

  echo -e "JWT secret ${BLUE}(any)${ENDCOLOR} ${SEE_GREEN}default : $jwt_secret${ENDCOLOR}"
  read input
  [[ -n "$input" ]] && jwt_secret="$input"

  echo -e "App mode ${BLUE}guest/normal${ENDCOLOR} ${SEE_GREEN}default : $app_mode${ENDCOLOR}"
  read input
  [[ -n "$input" ]] && app_mode="$input"

  if [[ "$app_mode" == "guest" ]]; then
    echo -e "Guest account email ${SEE_GREEN}default : $guest_email${ENDCOLOR}"
    read input
    [[ -n "$input" ]] && guest_email="$input"

    echo -e "Guest account password ${SEE_GREEN}default : $guest_password${ENDCOLOR}"
    read input
    [[ -n "$input" ]] && guest_password="$input"
  fi

  echo -e "${YELLOW}Writing .env file...${ENDCOLOR}"
  cat > .env <<EOF
DATABASE_URL=$database_url
JWT_SECRET=$jwt_secret
REACT_APP_ENVIRONMENT=$environment
REACT_APP_MODE=$app_mode
REACT_APP_GUEST_EMAIL=$guest_email
REACT_APP_GUEST_PASSWORD=$guest_password
EOF

  echo -e "${YELLOW}Running Neon database migration...${ENDCOLOR}"
  npm run db:migrate

  if [[ "$app_mode" == "guest" ]]; then
    echo -e "${YELLOW}Seeding guest user account...${ENDCOLOR}"
    npm run db:seed-guest
  fi

  echo -e "${BLUE}\nDo you want to start local dev server [y/n]?${ENDCOLOR}"
  read start_dev
  if [[ "$start_dev" == "y" || "$start_dev" == "Y" ]]; then
    if ! command -v netlify &> /dev/null; then
      echo -e "${YELLOW}Installing netlify-cli...${ENDCOLOR}"
      npm install -g netlify-cli
    fi
    netlify dev
  fi

elif [[ "$ans" == "2" ]]; then
  if ! command -v netlify &> /dev/null; then
    echo -e "${YELLOW}Installing netlify-cli...${ENDCOLOR}"
    npm install -g netlify-cli
  fi
  netlify dev
fi
