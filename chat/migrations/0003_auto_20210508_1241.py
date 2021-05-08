# Generated by Django 3.1.4 on 2021-05-08 12:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_auto_20210507_0515'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chat',
            name='p2p',
        ),
        migrations.AddField(
            model_name='chat',
            name='slug',
            field=models.SlugField(max_length=8, null=True, unique=True),
        ),
    ]
