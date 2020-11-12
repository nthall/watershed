# -*- coding: utf-8 -*-

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0005_auto_20161121_0051"),
    ]

    operations = [
        migrations.AlterField(
            model_name="item",
            name="position",
            field=models.PositiveIntegerField(default=1),
        ),
    ]
