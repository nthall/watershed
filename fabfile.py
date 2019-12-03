# -*- coding: utf-8 -*-
import datetime
from fabric import task
from invoke import Context

import pytz


@task
def test(c):
    c.run('ls -al /srv/watershed/deploys', echo=True)


@task(hosts=['prod'])
def deploy(c, migrate=False):
    """
    deploy to production.
    """

    GIT_SHA = git_hash()
    TIMESTAMP = datetime.datetime.now(pytz.timezone('America/New_York'))\
        .replace(microsecond=0).isoformat().replace(':', '.')
    DEPLOY_DIR = "/srv/watershed/deploys/{}_{}".format(TIMESTAMP, GIT_SHA)

    # ensure origin/master stays up to date
    c.local("git push origin master", echo=True)

    # sentry release
    VERSION = c.local("sentry-cli releases propose-version", echo=True).stdout
    c.local("sentry-cli releases new {}".format(VERSION), echo=True)
    c.local("sentry-cli releases set-commits --auto {}".format(VERSION), echo=True)
    c.local("git push deploy master", echo=True)

    c.run("/usr/bin/git clone file:///srv/watershed/watershed.git {}".format(DEPLOY_DIR), echo=True)

    c.run("virtualenv {}/.venv".format(DEPLOY_DIR), echo=True)
    with c.cd(DEPLOY_DIR):
        with c.prefix("source .venv/bin/activate"):
            c.run("pip install -r requirements.txt", echo=True)
            c.run("yarn install", echo=True)

            c.run("webpack --mode=production --config=webpack.config.js", echo=True)
            c.run("./manage.py collectstatic --noinput", echo=True)

            if migrate:
                c.run("./manage.py migrate")

            c.run("./manage.py compile_pyc")
            c.run("chgrp -R www-data . && chmod -R 775 .")

    c.run("ln -nsf {} /srv/watershed/live".format(DEPLOY_DIR))
    c.run(
        "ln -nsf /srv/watershed/live/watershed.uwsgi.ini /etc/uwsgi/apps-enabled/",
        echo=True
    )
    c.run("sudo service uwsgi reload")
    c.run(
        "ln -nsf /srv/watershed/live/watershed.nginx.conf /etc/nginx/sites-enabled/",
        echo=True
    )
    c.run("sudo service nginx reload")


@task()
def package_ext(c):
    """
    zip the extension. just making sure idk
    """

    GIT_SHA = git_hash()
    c.local("webpack --mode=production --browser")
    with c.local.cd("browser/dist"):
        c.local("zip -r ../releases/extension_{} *".format(GIT_SHA))


def git_hash():
    """
    get an identifier for HEAD
    """
    local = Context()
    return local.run("git rev-parse --short HEAD").stdout.rstrip("\n")
