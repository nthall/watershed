# -*- coding: utf-8 -*-
import datetime
from fabric import Connection, task

prod = Connection('watershed-prod')


@task
def deploy(c=prod, migrate=False):
    """
    deploy to production.
    """

    GIT_SHA = c.local("git rev-parse --short HEAD", capture=True)
    TIMESTAMP = datetime.datetime.now().replace(microsecond=0).isoformat()
    DEPLOY_DIR = "/srv/watershed/deploys/{}_{}".format(TIMESTAMP, GIT_SHA)

    c.local("git push origin master")

    # sentry release
    VERSION = c.local("sentry-cli releases propose-version", capture=True)
    c.local("sentry-cli releases new {}".format(VERSION))
    c.local("sentry-cli releases set-commits --auto {}".format(VERSION))

    c.local("git push deploy master")

    c.run("git clone /srv/watershed/watershed.git {}".format(DEPLOY_DIR))
    c.run("cd {}".format(DEPLOY_DIR))
    c.run("virtualenv .venv")
    c.run("source .venv/bin/activate")

    c.run("pip install -r requirements.txt")
    c.run("yarn install")

    c.run("webpack --config=webpack.config.js")
    c.run("./manage.py collectstatic --noinput")

    if migrate:
        c.run("./manage.py migrate")

    c.run("./manage.py compile_pyc")
    c.run("ln -nsf {} /srv/watershed/live".format(DEPLOY_DIR))
    c.run("sudo service uwsgi reload")
