from django.urls import path
from . import views

urlpatterns = [
    path("", views.getData, name="book"),
    path("scrap/", views.getScrappedData, name="scrap"),
]
