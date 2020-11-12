# -*- coding: utf-8 -*-

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_auto_20161118_0423"),
    ]

    operations = [
        migrations.AlterField(
            model_name="item",
            name="referrer",
            field=models.URLField(null=True),
        ),
    ]
