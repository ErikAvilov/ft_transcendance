FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app
COPY Project/ /app

RUN pip install django
RUN pip install python-dotenv
RUN pip install psycopg2
RUN pip install whitenoise
RUN pip install social-auth-app-django
RUN pip install django-oauth-toolkit
RUN pip install requests
RUN pip install argon2-cffi
RUN pip install django-otp
RUN pip install qrcode
RUN pip install channels
RUN pip install daphne
RUN pip install -U 'Twisted[tls,http2]'
RUN pip install crispy-bootstrap4
RUN pip install pillow
RUN pip install --upgrade django-crispy-forms
RUN pip install pyotp
RUN pip install httpie
RUN pip install django-rest-framework
RUN pip install djangorestframework-simplejwt
RUN pip install js2py
RUN pip install django-chartjs
RUN pip install jsonschema

RUN apt-get update && \
    apt-get install -y \
        build-essential \
        libpq-dev \
        zsh \
        netcat-traditional \
    && rm -rf /var/lib/apt/lists/* \
	pip install -r requirements.txt

RUN mkdir /cert
RUN chmod +x wait.sh

RUN openssl req -x509 -nodes -days 365 -newkey \
    rsa:2048 -keyout /cert/key.pem -out /cert/cert.pem -subj \
    "/C=FR/ST=France/L=Lyon/O=42/OU=LaRueZebi/CN=frigoplein.mooo.com"

EXPOSE 8000

CMD [ "bash", "wait.sh" ]
