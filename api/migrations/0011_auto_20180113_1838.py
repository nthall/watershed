# -*- coding: utf-8 -*-
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0010_auto_20161224_1901"),
    ]

    operations = [
        migrations.AlterField(
            model_name="item",
            name="played_on",
            field=models.DateTimeField(default=None, null=True),
        ),
    ]
