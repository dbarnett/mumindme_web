# [START gae_python37_app]
from flask import Flask, redirect


# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)


@app.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    return 'Hello World!'

@app.route('/projects')
def projects():
    """Redirect to a web-published Google Doc listing my projects for now."""
    return redirect('https://docs.google.com/document/d/e/2PACX-1vT6-Cr6yG5NQ3Mb4CR02pkoDY3qIDpmaI_TvryNmSpPn3jNobguIYwfgE9F7UTZBpDGnZSepX6F_C1h/pub')

@app.route('/blog')
def blog():
    """Redirect to Diffing Diffs blog (the nerdy one)."""
    return redirect('https://diffingdiffs.blogspot.com')

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python37_app]
