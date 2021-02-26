# !/bin/bash

cd frontend
yarn build
cd ../

docker build -t gatekeeper -f Dockerfile .
docker build -t gatekeeper-nginx -f NginxDockerfile .

docker tag gatekeeper-nginx:latest 411596790806.dkr.ecr.ap-northeast-1.amazonaws.com/gatekeeper:latest
docker tag gatekeeper-nginx:latest 411596790806.dkr.ecr.ap-northeast-1.amazonaws.com/gatekeeper-nginx:latest

aws ecr get-login-password --region ap-northeast-1 --profile gatekeeper | docker login --username AWS --password-stdin 411596790806.dkr.ecr.ap-northeast-1.amazonaws.com

docker push 411596790806.dkr.ecr.ap-northeast-1.amazonaws.com/gatekeeper:latest
docker push 411596790806.dkr.ecr.ap-northeast-1.amazonaws.com/gatekeeper-nginx:latest

