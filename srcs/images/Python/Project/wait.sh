APP_NAME="transcendance"
# Decommenter les 2 lignes suivantes pour ajouter un certificat et pouvoir se connecter en https
PATH_TO_CERT=/cert/cert.pem
PATH_TO_KEY=/cert/key.pem

#Code

if [ "$PATH_TO_CERT" != "" ]
then
    ARG=" -e ssl:8000:privateKey=$PATH_TO_KEY:certKey=$PATH_TO_CERT"
else
    ARG="-b 0.0.0.0"
fi

while ! nc -z db 5432; do
  sleep 0.1
done

python manage.py makemigrations
python manage.py migrate

actual=$(ls -la $(find . -regextype "posix-extended" -regex ".*(py|js|html)"))
daphne $ARG -v 3 $APP_NAME.asgi:application &
while true
do
    comp=$(ls -la $(find . -regextype "posix-extended" -regex ".*(py|js|html)"))
    if [ "$(diff <(echo $actual) <(echo $comp))" != "" ]
    then
        echo CHANGE
        kill $(ps -e | grep daphne | grep -v grep | awk '{print $1}')
        daphne $ARG -v 3 $APP_NAME.asgi:application &
        actual=$(ls -la $(find . -regextype "posix-extended" -regex ".*(py|js|html)"))
    fi
    sleep 1
done