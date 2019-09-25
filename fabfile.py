# -*- coding: utf-8 -*-
from fabric import Connection, task

prod = Connection('watershed-prod')


@task
def deploy(c=prod):
    """
    deploy to production.

    TODO: need to move to a method that allows deploys without breakage/downtime
    TODO: need to set up the git hook on live that handles shit on that end lol
    """
    c.local("git push origin master")
    c.run("cd /var/www/watershed && git pull")
