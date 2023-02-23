# waymorevidya

## gcloud auth

- `gcloud auth login`
- `gcloud config set project waymorevidya`

## build api docker

- `docker build -t gcr.io/waymorevidya/api:latest -f dockerfiles/api.Dockerfile .`
- `docker push gcr.io/waymorevidya/api:latest`

## deploy to cloud run

- `gcloud run deploy api --image gcr.io/waymorevidya/api:latest --platform managed --region australia-southeast2 --allow-unauthenticated`

## retrieve endpoint

- `gcloud run services describe api --region australia-southeast2 --format='value(status.url)'`
