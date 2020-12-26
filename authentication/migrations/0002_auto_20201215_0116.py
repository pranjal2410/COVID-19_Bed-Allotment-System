# Generated by Django 3.1.4 on 2020-12-14 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='birthday',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='contact',
            field=models.PositiveBigIntegerField(null=True, unique=True),
        ),
    ]