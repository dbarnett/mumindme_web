# mumind.me web

Web app serving mumind.me

## To deploy

Start a Cloud Shell at
https://console.cloud.google.com/home/dashboard?project=mumind-me-web.

### Preview the local version

```shell
gcloud beta code dev
```

Click the preview link in shell output (something like 0.0.0.0:8080, but should
automatically expand to valid preview URL on ctrl+click).

### Deploy

When everything looks good to deploy:

```shell
gcloud run deploy mumindme-web --source=.
```

### For more details

Previously used GAE, migrated to Cloud Run using
[Cloud Run w/ Buildpacks codelab](https://codelabs.developers.google.com/codelabs/cloud-gae-python-migrate-5-runbldpks).

One gotcha: Seemed to work better _without_ a Procfile (started gunicorn instead
of Flask dev server). My first attempt with `web: python main.py` in a Procfile
failed to start (maybe just a fluke?).