"""
Django settings for todoproject project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
if 'DJANGO_SECRET_KEY' in os.environ:
	SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
else:
	SECRET_KEY = 'ghjt(cq72wtdvc%rsg85%4j)%3=xcgk99phwrzeu4^10u60ds9'

# SECURITY WARNING: don't run with debug turned on in production!
if 'NO_DEBUG' in os.environ:
	DEBUG = False
else:
	DEBUG = True

if 'NO_DEBUG' in os.environ:
	TEMPLATE_DEBUG = False
else:
	TEMPLATE_DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = (
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
	'todo',
	'tastypie',
)

MIDDLEWARE_CLASSES = (
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'todoproject.urls'

WSGI_APPLICATION = 'todoproject.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases


import dj_database_url
if 'DATABASE_URL' in os.environ:
	DATABASES = {
		'default': dj_database_url.config(),
	}
else:
	DATABASES = {
		'default': {
			'ENGINE': 'django.db.backends.sqlite3',
			'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
		}
	}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/
STATIC_ROOT = 'staticfiles'
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

LOGIN_URL = '/login/'

# Heroku settings
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# disable tastypie pagination
API_LIMIT_PER_PAGE = 0