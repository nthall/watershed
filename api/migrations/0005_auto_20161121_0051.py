# -*- coding: utf-8 -*-

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_auto_20161119_0431"),
    ]

    operations = [
        migrations.AlterField(
            model_name="item",
            name="played_on",
            field=models.DateTimeField(null=True),
        ),
    ]
