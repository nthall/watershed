# -*- coding: utf-8 -*-
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0007_auto_20161201_0127"),
    ]

    operations = [
        migrations.AddField(
            model_name="item",
            name="embed",
            field=models.TextField(null=True),
        ),
    ]
