# -*- coding: utf-8 -*-

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0006_auto_20161121_0104"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="item",
            name="played",
        ),
        migrations.AlterField(
            model_name="item",
            name="position",
            field=models.IntegerField(default=1),
        ),
    ]
