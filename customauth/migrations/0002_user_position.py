# -*- coding: utf-8 -*-
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("customauth", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="position",
            field=models.IntegerField(default=0),
        ),
    ]
