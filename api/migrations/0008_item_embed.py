# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-12-07 00:57
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20161201_0127'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='embed',
            field=models.TextField(null=True),
        ),
    ]
