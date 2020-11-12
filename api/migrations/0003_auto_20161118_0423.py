# -*- coding: utf-8 -*-

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_auto_20161115_0306"),
    ]

    operations = [
        migrations.AddField(
            model_name="item",
            name="artist",
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="item",
            name="title",
            field=models.CharField(max_length=255, null=True),
        ),
    ]
