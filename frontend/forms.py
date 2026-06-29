from django import forms
from django.contrib.auth.models import User
from .models import Course, Group, Student, MarketingSurvey, LessonTime, Branch, Room, Role, Position, Employee


class LoginForm(forms.Form):
    phone = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            "placeholder": "XX XXX XX XX",
            "class": "form-control phone-input",
        }),
        label="Telefon raqam",
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={"placeholder": "Parol", "class": "form-control"}),
        label="Parol",
    )


class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ["name"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Kurs nomini kiriting"}),
        }


class GroupForm(forms.ModelForm):
    start_date = forms.DateField(
        required=False,
        input_formats=["%Y-%m-%d", "%d.%m.%Y", "%d/%m/%Y"],
        widget=forms.DateInput(attrs={"class": "form-control", "type": "date"}, format="%Y-%m-%d"),
        label="Boshlanish sanasi",
    )
    end_date = forms.DateField(
        required=False,
        input_formats=["%Y-%m-%d", "%d.%m.%Y", "%d/%m/%Y"],
        widget=forms.DateInput(attrs={"class": "form-control", "type": "date"}, format="%Y-%m-%d"),
        label="Tugash sanasi",
    )

    class Meta:
        model = Group
        fields = ["name", "status", "course", "education_type", "day_type", "room", "teacher", "telegram_link", "start_date", "end_date"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Guruh nomini kiriting"}),
            "status": forms.Select(attrs={"class": "form-control"}),
            "course": forms.Select(attrs={"class": "form-control"}),
            "education_type": forms.Select(attrs={"class": "form-control"}),
            "day_type": forms.Select(attrs={"class": "form-control"}),
            "room": forms.Select(attrs={"class": "form-control"}),
            "teacher": forms.Select(attrs={"class": "form-control"}),
            "telegram_link": forms.URLInput(attrs={"class": "form-control", "placeholder": "https://t.me/..."}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["room"].queryset = Room.objects.all()
        self.fields["room"].empty_label = "--- Tanlang ---"
        self.fields["teacher"].queryset = Employee.objects.filter(role__name="O'qituvchi")
        self.fields["teacher"].empty_label = "--- Tanlang ---"

    def clean(self):
        cleaned_data = super().clean()
        status = cleaned_data.get("status")
        start_date = cleaned_data.get("start_date")
        end_date = cleaned_data.get("end_date")
        if status != "kutilyotgan" and not (start_date and end_date):
            raise forms.ValidationError("⚠ Aktiv guruh uchun boshlanish va tugash sanalari majburiy!")
        if start_date and end_date and end_date <= start_date:
            raise forms.ValidationError("⚠ Tugash sanasi boshlanish sanasidan keyin bo'lishi kerak!")
        room = cleaned_data.get("room")
        teacher = cleaned_data.get("teacher")
        return cleaned_data


class StudentCreateForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = [
            "first_name", "last_name", "phone", "desired_course", "groups",
            "marketing_survey", "additional_info",
            "father_full_name", "father_phone",
            "mother_full_name", "mother_phone",
        ]
        widgets = {
            "first_name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Ismini kiriting"}),
            "last_name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Familyasini kiriting"}),
            "phone": forms.TextInput(attrs={"class": "form-control", "placeholder": "+998 XX XXX XX XX"}),
            "desired_course": forms.Select(attrs={"class": "form-control"}),
            "groups": forms.SelectMultiple(attrs={"class": "form-control", "size": 6}),
            "birth_date": forms.DateInput(attrs={"class": "form-control", "type": "date"}),
            "marketing_survey": forms.Select(attrs={"class": "form-control"}),
            "additional_info": forms.Textarea(attrs={"class": "form-control", "placeholder": "Qo'shimcha ma'lumotlar", "rows": 3}),
            "father_full_name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Otasining ism familyasi"}),
            "father_phone": forms.TextInput(attrs={"class": "form-control", "placeholder": "+998 XX XXX XX XX"}),
            "mother_full_name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Onasining ism familyasi"}),
            "mother_phone": forms.TextInput(attrs={"class": "form-control", "placeholder": "+998 XX XXX XX XX"}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["desired_course"].empty_label = "-- Kurs tanlang --"
        self.fields["desired_course"].queryset = Course.objects.all()
        self.fields["groups"].queryset = Group.objects.filter(status__in=["aktiv", "kutilyotgan"]).order_by("name")
        self.fields["groups"].required = False
        self.fields["groups"].label = "Guruhlar"


class StudentEditForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = [
            "first_name", "last_name", "phone", "desired_course", "groups",
            "marketing_survey", "additional_info",
            "father_full_name", "father_phone",
            "mother_full_name", "mother_phone",
        ]
        widgets = {
            "first_name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Ismini kiriting"}),
            "last_name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Familyasini kiriting"}),
            "phone": forms.TextInput(attrs={"class": "form-control", "placeholder": "+998 XX XXX XX XX"}),
            "desired_course": forms.Select(attrs={"class": "form-control"}),
            "groups": forms.SelectMultiple(attrs={"class": "form-control", "size": 6}),
            "birth_date": forms.DateInput(attrs={"class": "form-control", "type": "date"}),
            "marketing_survey": forms.Select(attrs={"class": "form-control"}),
            "additional_info": forms.Textarea(attrs={"class": "form-control", "placeholder": "Qo'shimcha ma'lumotlar", "rows": 3}),
            "father_full_name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Otasining ism familyasi"}),
            "father_phone": forms.TextInput(attrs={"class": "form-control", "placeholder": "+998 XX XXX XX XX"}),
            "mother_full_name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Onasining ism familyasi"}),
            "mother_phone": forms.TextInput(attrs={"class": "form-control", "placeholder": "+998 XX XXX XX XX"}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["desired_course"].empty_label = "-- Kurs tanlang --"
        self.fields["desired_course"].queryset = Course.objects.all()
        self.fields["groups"].queryset = Group.objects.filter(status__in=["aktiv", "kutilyotgan"]).order_by("name")
        self.fields["groups"].required = False
        self.fields["groups"].label = "Guruhlar"


class MarketingSurveyForm(forms.ModelForm):
    class Meta:
        model = MarketingSurvey
        fields = ["name"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control", "placeholder": "So'rovnoma turini kiriting (masalan: Banner orqali, Do'st taklif qildi)"}),
        }


class FreezeForm(forms.Form):
    days = forms.IntegerField(
        min_value=1, max_value=365,
        widget=forms.NumberInput(attrs={"class": "form-control", "placeholder": "Necha kun?", "min": 1, "max": 365}),
        label="Muzlatish muddati (kun)",
    )
    reason = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"class": "form-control", "placeholder": "Muzlatish sababi (ixtiyoriy)", "rows": 3}),
        label="Sabab",
    )


class RemoveFromGroupForm(forms.Form):
    reason = forms.CharField(
        required=True,
        widget=forms.Textarea(attrs={"class": "form-control", "placeholder": "Chiqarish sababini yozing", "rows": 3}),
        label="Chiqarish sababi",
    )


class LessonTimeForm(forms.ModelForm):
    days = forms.MultipleChoiceField(
        choices=LessonTime.DAY_CHOICES,
        widget=forms.CheckboxSelectMultiple(attrs={"class": "checkbox-group"}),
        label="Hafta kunlari",
    )

    class Meta:
        model = LessonTime
        fields = ["days", "start_time", "end_time"]
        widgets = {
            "start_time": forms.TimeInput(attrs={"class": "form-control", "type": "time"}, format="%H:%M"),
            "end_time": forms.TimeInput(attrs={"class": "form-control", "type": "time"}, format="%H:%M"),
        }
        labels = {
            "start_time": "Boshlanish vaqti",
            "end_time": "Tugash vaqti",
        }

    def __init__(self, *args, **kwargs):
        self.group = kwargs.pop("group", None)
        super().__init__(*args, **kwargs)

    def clean_days(self):
        days = self.cleaned_data["days"]
        return ",".join(days)

    def clean(self):
        cleaned_data = super().clean()
        days_str = cleaned_data.get("days")
        start_time = cleaned_data.get("start_time")
        end_time = cleaned_data.get("end_time")
        if not (self.group and days_str and start_time and end_time):
            return cleaned_data
        new_days = set(d.strip().lower() for d in days_str.split(",") if d.strip())
        errors = []
        if self.group.room:
            room_conflicts = LessonTime.objects.filter(
                group__room=self.group.room,
                start_time__lt=end_time,
                end_time__gt=start_time,
            ).exclude(group=self.group).select_related("group")
            for lt in room_conflicts:
                lt_days = set(d.strip().lower() for d in lt.days.split(",") if d.strip())
                if not new_days.isdisjoint(lt_days):
                    errors.append(
                        f"⚠ Bu vaqtda xona band! "
                        f"({lt.group.name}: {lt.get_days_display()} "
                        f"{lt.start_time.strftime('%H:%M')}-{lt.end_time.strftime('%H:%M')})"
                    )
                    break
        if self.group.teacher:
            teacher_conflicts = LessonTime.objects.filter(
                group__teacher=self.group.teacher,
                start_time__lt=end_time,
                end_time__gt=start_time,
            ).exclude(group=self.group).select_related("group")
            for lt in teacher_conflicts:
                lt_days = set(d.strip().lower() for d in lt.days.split(",") if d.strip())
                if not new_days.isdisjoint(lt_days):
                    errors.append(
                        f"⚠ Bu vaqtda o'qituvchi band! "
                        f"({lt.group.name}: {lt.get_days_display()} "
                        f"{lt.start_time.strftime('%H:%M')}-{lt.end_time.strftime('%H:%M')})"
                    )
                    break
        if errors:
            raise forms.ValidationError(" ".join(errors))
        return cleaned_data


class AddToGroupForm(forms.Form):
    group = forms.ModelChoiceField(
        queryset=Group.objects.filter(status="aktiv"),
        widget=forms.Select(attrs={"class": "form-control"}),
        label="Guruhni tanlang",
        empty_label="--- Guruh tanlang ---",
    )
    reason = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"class": "form-control", "placeholder": "Qo'shimcha izoh (ixtiyoriy)", "rows": 2}),
        label="Izoh",
    )


class BranchForm(forms.ModelForm):
    class Meta:
        model = Branch
        fields = ["name"]
        widgets = {
            "name": forms.TextInput(attrs={
                "class": "form-control", "placeholder": "Filial nomini kiriting"
            }),
        }


class RoomForm(forms.ModelForm):
    class Meta:
        model = Room
        fields = ["name"]
        widgets = {
            "name": forms.TextInput(attrs={
                "class": "form-control", "placeholder": "Xona nomini kiriting"
            }),
        }


class PositionForm(forms.ModelForm):
    class Meta:
        model = Position
        fields = ["name"]
        widgets = {
            "name": forms.TextInput(attrs={
                "class": "form-control", "placeholder": "Vazifa nomini kiriting"
            }),
        }


class EmployeeForm(forms.ModelForm):
    password = forms.CharField(
        required=False,
        label="Parol",
        widget=forms.PasswordInput(attrs={
            "class": "form-input", "placeholder": "Parolni kiriting"
        }),
        help_text="Xodim tizimga kirishi uchun parol",
    )

    class Meta:
        model = Employee
        fields = [
            "first_name", "last_name", "phone", "email", "gender",
            "birth_date", "position", "photo", "salary_enabled",
            "branches", "role", "salary_same", "salary", "notes",
        ]
        widgets = {
            "first_name": forms.TextInput(attrs={"class": "form-input", "placeholder": "Ismni kiriting"}),
            "last_name": forms.TextInput(attrs={"class": "form-input", "placeholder": "Familiyani kiriting"}),
            "phone": forms.TextInput(attrs={"class": "form-input", "placeholder": "XX XXX XX XX"}),
            "email": forms.EmailInput(attrs={"class": "form-input", "placeholder": "example@mail.com"}),
            "gender": forms.Select(attrs={"class": "form-input"}, choices=[("", "Tanlang"), ("erkak", "Erkak"), ("ayol", "Ayol")]),
            "birth_date": forms.DateInput(attrs={"class": "form-input", "type": "date"}),
            "position": forms.Select(attrs={"class": "form-input"}),
            "salary_enabled": forms.CheckboxInput(attrs={"class": "hidden"}),
            "branches": forms.CheckboxSelectMultiple(),
            "role": forms.Select(attrs={"class": "form-input"}),
            "salary_same": forms.CheckboxInput(attrs={"class": "hidden"}),
            "salary": forms.NumberInput(attrs={"class": "form-input", "placeholder": "0"}),
            "notes": forms.Textarea(attrs={"class": "form-input", "placeholder": "Xodim haqida qo'shimcha ma'lumot...", "rows": 4}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["position"].queryset = Position.objects.all()
        self.fields["position"].empty_label = "Tanlang"
        self.fields["branches"].queryset = Branch.objects.all()
        self.fields["role"].queryset = Role.objects.all()
        self.fields["role"].empty_label = "Tanlang"
