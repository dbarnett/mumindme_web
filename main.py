# [START gae_python37_app]
import logging

from flask import Flask, redirect, render_template, url_for


# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


@app.route('/')
def home():
    """Redirects to /projects."""
    return redirect(url_for('projects'))

@app.route('/projects')
def projects():
    """Show projects page."""
    return render_template('projects.html')

@app.route('/blog')
def blog():
    """Redirect to Diffing Diffs blog (the nerdy one)."""
    return redirect('https://diffingdiffs.blogspot.com')

@app.route('/linkedin')
def linkedin():
    """Redirect to my LinkedIn profile."""
    return redirect('https://www.linkedin.com/in/david-barnett-bb22b636/')

@app.errorhandler(500)
def server_error(e):
    logging.exception('An error occurred during a request.')
    return """
    An internal error occurred: <pre>{}</pre>
    See logs for full stacktrace.
    """.format(e), 500

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python37_app]
