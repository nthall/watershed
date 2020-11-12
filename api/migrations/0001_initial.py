# -*- coding: utf-8 -*-

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Item",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("uri", models.URLField()),
                (
                    "platform",
                    models.IntegerField(
                        choices=[(0, "Soundcloud"), (1, "Bandcamp"), (2, "Youtube")]
                    ),
                ),
                ("referrer", models.URLField()),
                ("position", models.PositiveIntegerField()),
                ("added_on", models.DateTimeField(auto_now_add=True)),
                ("played", models.BooleanField(default=False)),
                ("played_on", models.DateTimeField()),
                ("fave", models.BooleanField(default=False)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ("position",),
            },
        ),
    ]
