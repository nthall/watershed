# -*- coding: utf-8 -*-

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="item",
            name="platform",
            field=models.IntegerField(
                choices=[
                    (0, "Unknown"),
                    (1, "Bandcamp"),
                    (2, "Youtube"),
                    (3, "Soundcloud"),
                ]
            ),
        ),
        migrations.AlterField(
            model_name="item",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="items",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
