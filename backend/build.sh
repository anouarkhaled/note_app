set -o errexit
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
if ["$DJANGO_SUPERUSER_USERNAME" ] && [ "$DJANGO_SUPERUSER_PASSWORD" ] && [ "$DJANGO_SUPERUSER_EMAIL" ]; then
    python manage.py createsuperuser --noinput
fi
