echo "Fetching code..."
git checkout staging
git fetch --prune
git pull origin staging
git merge --no-ff develop

echo "Rebuilding code..."
rm -rf dist
git add .
git commit -m 'removing old version'
yarn run build

echo "Uploading..."
git add .
git commit -m 'building new version'
git push staging staging --force
