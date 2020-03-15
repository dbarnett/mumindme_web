# mumind.me web

Web app serving mumind.me

## To deploy

Start a Cloud Shell at
https://console.cloud.google.com/home/dashboard?project=mumind-me-web.

### Preview the local version

Activate virtualenv (make sure virtualenvwrapper is installed and run something like `workon me_web`).

Run `python main.py`.

Click `Web Preview` toolbar button at top right.

### Deploy

When everything looks good to deploy:

```sh
gcloud app deploy
```

### For more details

More instructions in [GAE (Python) Guided Walkthrough](https://console.cloud.google.com/start?tutorial=python_mvms_quickstart).
