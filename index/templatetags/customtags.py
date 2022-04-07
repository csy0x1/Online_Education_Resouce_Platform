from django import template

register = template.Library()


@register.filter(name="toAlphaBet")
def toAlphaBet(value):
    return chr(64 + value)
