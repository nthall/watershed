# -*- coding: utf-8 -*-

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0008_item_embed"),
    ]

    operations = [
        migrations.AlterField(
            model_name="item",
            name="artist",
            field=models.CharField(blank=True, default="", max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="item",
            name="embed",
            field=models.TextField(blank=True, default=""),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="item",
            name="referrer",
            field=models.URLField(blank=True, default=""),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="item",
            name="title",
            field=models.CharField(blank=True, default="", max_length=255),
            preserve_default=False,
        ),
    ]
