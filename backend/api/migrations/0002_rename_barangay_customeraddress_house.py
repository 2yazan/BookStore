# Generated by Django 4.1.4 on 2024-10-21 19:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customeraddress',
            old_name='Barangay',
            new_name='House',
        ),
    ]
