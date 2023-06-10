from django.apps import AppConfig
import os
from backend import settings

class LecturesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'lectures'

    def ready(self) -> None:
        super().ready()
        if os.environ.get('RUN_MAIN', None) != 'true':
            if settings.SCHEDULER_DEFAULT:
                from . import operator
                operator.start()
