# Generated by Django 4.0.3 on 2022-04-10 12:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0043_alter_paper_starttime_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paper',
            name='PaperType',
            field=models.BooleanField(default=False, verbose_name='试卷类型'),
        ),
    ]
