import os
import django
import threading

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendance.settings')
django.setup()

from accounts.forms import *
from accounts.models import *
from names import new_names_1, new_names_2, new_names_3

names = [
    "John", "Emma", "Michael", "Olivia", "William", "Ava", "James", "Sophia", "Benjamin", "Isabella",
    "Jacob", "Mia", "Ethan", "Charlotte", "Alexander", "Amelia", "Daniel", "Harper", "Matthew", "Evelyn",
    "Noah", "Abigail", "Samuel", "Emily", "David", "Elizabeth", "Joseph", "Avery", "Henry", "Sofia",
    "Jackson", "Ella", "Sebastian", "Scarlett", "Aiden", "Grace", "Lucas", "Chloe", "Carter", "Victoria",
    "Gabriel", "Riley", "Oliver", "Aria", "Anthony", "Lily", "Leo", "Layla", "Isaac", "Zoey",
    "Dylan", "Penelope", "Wyatt", "Nora", "Andrew", "Hannah", "Luke", "Mila", "Joshua", "Addison",
    "Caleb", "Brooklyn", "Jack", "Eleanor", "Nathan", "Madelyn", "Ryan", "Ellie", "Julian", "Hazel",
    "Hunter", "Natalie", "Levi", "Luna", "Christian", "Savannah", "Isaiah", "Claire", "Owen", "Skylar",
    "Landon", "Violet", "Charles", "Paisley", "Thomas", "Audrey", "Aaron", "Stella", "Eli", "Caroline",
    "Connor", "Naomi", "Jeremiah", "Genesis", "Cameron", "Bella", "Adrian", "Quinn", "Colton", "Sadie"
]



def create_them():
	for name in names:
		email = name + '.123@yahoo.com'
		password = 'anasmaxkk5'
		my_form = {'username' : name, 'email': email, 'password1' : password, 'password2' : password}
		form = UserRegisterForm(my_form)
		if form.is_valid():
			print(f'valid! - {name}')
			form.save()

def create_test_1():
	for name in new_names_1:
		email = name + '.123@yahoo.com'
		password = 'anasmaxkk5'
		my_form = {'username' : name, 'email': email, 'password1' : password, 'password2' : password}
		form = UserRegisterForm(my_form)
		if form.is_valid():
			form.save()

def create_test_2():
	for name in new_names_2:
		email = name + '.123@yahoo.com'
		password = 'anasmaxkk5'
		my_form = {'username' : name, 'email': email, 'password1' : password, 'password2' : password}
		form = UserRegisterForm(my_form)
		if form.is_valid():
			form.save()

def create_test_3():
	for name in new_names_3:
		email = name + '.123@yahoo.com'
		password = 'anasmaxkk5'
		my_form = {'username' : name, 'email': email, 'password1' : password, 'password2' : password}
		form = UserRegisterForm(my_form)
		if form.is_valid():
			form.save()

create_test_1()
create_test_2()
create_test_3()