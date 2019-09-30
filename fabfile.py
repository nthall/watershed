# -*- coding: utf-8 -*-
import datetime
from fabric import Connection, task
from invoke import Context

prod = Connection('watershed-prod')
local = Context()


@task
def test(c):
    c.run('ls /srv/watershed/watershed.git', echo=True)


@task
def deploy(remote=prod, migrate=False):
    """
    deploy to production.
    """

    local = Context()

    GIT_SHA = git_hash()
    TIMESTAMP = datetime.datetime.now().replace(microsecond=0).isoformat()
    DEPLOY_DIR = "/srv/watershed/deploys/{}_{}".format(TIMESTAMP, GIT_SHA)

    local.run("git push origin master", echo=True)

    # sentry release
    VERSION = local.run("sentry-cli releases propose-version", echo=True).stdout
    local.run("sentry-cli releases new {}".format(VERSION), echo=True)
    local.run("sentry-cli releases set-commits --auto {}".format(VERSION), echo=True)

    local.run("git push deploy master -vvv", echo=True)

    remote.run("git clone /srv/watershed/watershed.git {}".format(DEPLOY_DIR), echo=True)
    remote.cd(DEPLOY_DIR, echo=True)
    remote.run("virtualenv .venv", echo=True)
    remote.run("source .venv/bin/activate", echo=True)

    remote.run("pip install -r requirements.txt", echo=True)
    remote.run("yarn install", echo=True)

    remote.run("webpack --mode=production --config=webpack.config.js", echo=True)
    remote.run("./manage.py collectstatic --noinput", echo=True)

    if migrate:
        remote.run("./manage.py migrate", echo=True)

    remote.run("./manage.py compile_pyc", echo=True)
    remote.run("ln -nsf {} /srv/watershed/live".format(DEPLOY_DIR), echo=True)
    remote.run("sudo service uwsgi reload", echo=True)


@task
def package_ext(c=local):
    """
    zip the extension. just making sure idk
    """

    GIT_SHA = git_hash()
    local.run("webpack --mode=production --browser", echo=True)
    with local.cd("browser/dist"):
        local.run("zip -r ../releases/extension_{} *".format(GIT_SHA), echo=True)


def git_hash():

    local = Context()
    return local.run("git rev-parse --short HEAD", echo=True).stdout.rstrip("\n")
