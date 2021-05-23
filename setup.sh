echo "Welcome"

npm install

npm install fauna-shell --only=dev

echo "Login to fauna"
npm fauna cloud-login
echo "data base name : "
dbName = readline()