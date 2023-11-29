#!/bin/bash

echo "deb http://security.ubuntu.com/ubuntu xenial-security main" >> /etc/apt/sources.list
echo "deb http://cz.archive.ubuntu.com/ubuntu xenial main universe" >> /etc/apt/sources.list

apt-get update -y && apt-get install -y gettext-base curl
chsh -s /bin/bash

BASH_REPO=bash-scripts-pipelines

curl --request GET \
  --url https://api.bitbucket.org/2.0/repositories/mtrix2/$BASH_REPO \
  --header "Authorization: Bearer $PIPE_BASH_SCRIPT_TOKEN" \
  --header 'Accept: application/json'


git clone https://x-token-auth:$PIPE_BASH_SCRIPT_TOKEN@bitbucket.org/mtrix2/$BASH_REPO.git

mv $BASH_REPO/* .

for file in $(find . -regex '.*\.sh');do
  chmod +x $file
done

. ./pre-script-setup.sh
