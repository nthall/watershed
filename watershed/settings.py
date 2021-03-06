# -*- coding: utf-8 -*-
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = os.getenv('WATERSHED_SECRET_KEY')

DEBUG = os.getenv('DEBUG', False)

if DEBUG:
    ALLOWED_HOSTS = ['watershed.nthall.com', 'watershed-dev.nthall.com']
else:
    ALLOWED_HOSTS = ['watershed.rocks']


INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 3rd party
    'passwords',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_bulk',
    'webpack_loader',
    'django_extensions',
    'raven.contrib.django.raven_compat',

    # app
    'customauth.apps.CustomauthConfig',
    'api.apps.ApiConfig',
    'player.apps.PlayerConfig',
    'stats.apps.StatsConfig'
)

AUTH_USER_MODEL = 'customauth.User'

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'watershed.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'watershed.wsgi.application'


# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'watershed',
        'USER': 'www-data',
        'PASSWORD': os.getenv('WATERSHED_POSTGRESQL_PASSWORD'),
        'HOST': '/var/run/postgresql/',
        'PORT': 5434
    }
}

if not DEBUG:
    DATABASES['default']['USER'] = 'watershed'


# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'America/New York'
USE_I18N = True
USE_L10N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'frontend'),
)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR + STATIC_URL


PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
    'django.contrib.auth.hashers.BCryptPasswordHasher',
]

PASSWORD_MIN_LENGTH = 8


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication'
    ]
}


WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': not DEBUG,
        'BUNDLE_DIR_NAME': 'bundles/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json')
    }
}


# LOGGING/SENTRY SETTINGS
import sentry_sdk  # noqa: E402
from sentry_sdk.integrations.django import DjangoIntegration  # noqa: E402
if DEBUG:
    SENTRY_ENV = 'test'
else:
    SENTRY_ENV = 'production'

import subprocess  # noqa: E402
release = subprocess.check_output("git rev-parse HEAD")

sentry_sdk.init(
    dsn='https://69327d4caef74ac694a6a76e93c96524:a9698b5624fe450b90626dbee1746e92@sentry.io/274934',  # noqa: E501
    release=release,
    integrations=[DjangoIntegration()],
    environment=SENTRY_ENV
)

default_handler = 'file'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'formatters': {
        'verbose': {
            'format': "[%(asctime)s] %(levelname)s \
                       [%(name)s:%(lineno)s] %(message)s",
            'datefmt': "%d/%b/%Y %H:%M:%S"
        },
        'simple': {
            'format': '%(levelname)s - %(message)s'
        },
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR + '/app.log',
            'formatter': 'verbose'
        },
        'stdout': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'sentry': {
            'level': 'ERROR',
            'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler'
        }
    },
    'loggers': {
        'django': {
            'handlers': [default_handler, 'mail_admins', 'sentry'],
            'level': 'ERROR',
            'propagate': True,
        },
        'watershed': {
            'handlers': [default_handler, 'sentry'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'api': {
            'handlers': [default_handler, 'sentry'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'rest_framework': {
            'handlers': [default_handler, 'sentry'],
            'level': 'ERROR',
            'propagate': True,
        },
        'customauth': {
            'handlers': [default_handler, 'sentry'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'js': {
            'handlers': [default_handler],
            'level': 'DEBUG',
            'propagate': False,
        },
    }
}
