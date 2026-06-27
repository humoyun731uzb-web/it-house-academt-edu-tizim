from django import template

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
