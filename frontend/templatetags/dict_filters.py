from django import template
from decimal import Decimal

register = template.Library()

@register.filter
def get_item(dictionary, key):
    if dictionary is None:
        return None
    return dictionary.get(key)

@register.filter
def get_key(dictionary, key):
    """Return value or empty dict for chained lookups"""
    if dictionary is None:
        return {}
    return dictionary.get(key, {})

@register.filter
def has_key(dictionary, key):
    if dictionary is None:
        return False
    return key in dictionary

@register.filter
def get_balance(student):
    try:
        return student.balance
    except:
        from ..models import StudentBalance
        balance, _ = StudentBalance.objects.get_or_create(student=student, defaults={"balance": Decimal('0.00')})
        return balance
