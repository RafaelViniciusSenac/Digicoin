# Generated by Django 4.2.19 on 2025-03-21 23:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_campanha_compra_customuser_ra_produto_itenscompra_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='imgPerfil',
            field=models.CharField(default=False, max_length=100),
        ),
        migrations.AddField(
            model_name='customuser',
            name='saldo',
            field=models.IntegerField(default=0),
        ),
    ]
