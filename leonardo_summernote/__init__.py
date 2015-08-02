
from django.utils.translation import ugettext_lazy as _

from django.apps import AppConfig

default_app_config = 'leonardo_summernote.Config'

LEONARDO_URLS_CONF = 'django_summernote.urls'

LEONARDO_APPS = [
    'django_summernote',
    'leonardo_summernote',
]

LEONARDO_JS_FILES = [
    'django_summernote/jquery.fileupload.js',
    'django_summernote/jquery.ui.widget.js',
    'django_summernote/jquery.iframe-transport.js',
    'django_summernote/summernote.min.js',
    'django_summernote/init.js',
]

LEONARDO_CSS_FILES = [
    'django_summernote/django_summernote.css',
    'django_summernote/django_summernote_inplace.css',
    'django_summernote/summernote.css',
]


class Config(AppConfig):
    name = 'leonardo_summernote'
    verbose_name = _("Leonardo Summernote")

    def ready(self):

        # path forms
        from leonardo.module.web.widgets import forms as widget_forms
        from django_summernote.widgets import SummernoteInplaceWidget
        widget_forms.WIDGETS['text'] = SummernoteInplaceWidget()
