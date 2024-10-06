from rest_framework import serializers


class SpecialCharactersValidator:

    def __call__(self, text):
        if not text.isalnum():
            message = "Это поле не может содержать специальные символы"
            raise serializers.ValidationError(message)

class ProjectNameValidator:

    def __call__(self, text):
        text = text.replace(' ', '')
        if not text.isalnum():
            message = "Это поле не может содержать специальные символы"
            raise serializers.ValidationError(message)

class OnlyTextValidator:

    def __call__(self, text):
        if not text.isalpha():
            message = "Поле может содержать только буквы"
            raise serializers.ValidationError(message)
