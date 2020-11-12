# -*- coding: utf-8 -*-

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0009_auto_20161207_0239"),
    ]

    operations = [
        migrations.AlterField(
            model_name="item",
            name="position",
            field=models.IntegerField(null=True),
        ),
    ]
