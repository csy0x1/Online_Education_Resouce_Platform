# Generated by Django 3.1.7 on 2021-06-14 19:35

from django.db import migrations, models
import django.db.models.deletion
import index.models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0036_chapter_section'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='chapter',
            options={'ordering': ['sourceCourse'], 'verbose_name': '章名', 'verbose_name_plural': '章名'},
        ),
        migrations.AlterModelOptions(
            name='section',
            options={'ordering': ['sourceChapter'], 'verbose_name': '节名', 'verbose_name_plural': '节名'},
        ),
        migrations.RemoveField(
            model_name='section',
            name='courseFile',
        ),
        migrations.CreateModel(
            name='CourseFiles',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('courseFile', models.FileField(blank=True, null=True, upload_to=index.models.Upload_File_Path)),
                ('sourceSection', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sourceSection', to='index.section', verbose_name='所属节')),
            ],
            options={
                'verbose_name': '文件名',
                'verbose_name_plural': '文件名',
                'ordering': ['sourceSection'],
            },
        ),
    ]
