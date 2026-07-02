from django.db import models
from datetime import date, timedelta, datetime
from decimal import Decimal


class Course(models.Model):
    name = models.CharField(max_length=255, verbose_name="Kurs nomi")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Kurs"
        verbose_name_plural = "Kurslar"


class MarketingSurvey(models.Model):
    name = models.CharField(max_length=255, verbose_name="So'rovnoma turi")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Marketing so'rovnoma"
        verbose_name_plural = "Marketing so'rovnomalar"


class Group(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "aktiv", "Aktiv"
        PENDING = "kutilyotgan", "Kutilyotgan"
        CLOSED = "yopilgan", "Yopilgan"
        ARCHIVED = "arxivlangan", "Arxivlangan"

    class EducationType(models.TextChoices):
        ONLINE = "onlayn", "Onlayn"
        OFFLINE = "oflayn", "Oflayn"

    class DayType(models.TextChoices):
        ODD = "toq", "Toq kunlar"
        EVEN = "juft", "Juft kunlar"
        EVERYDAY = "har_kun", "Har kunlik"

    name = models.CharField(max_length=255, verbose_name="Guruh nomi")
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        verbose_name="Guruh holati",
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="groups", verbose_name="Kurs"
    )
    education_type = models.CharField(
        max_length=20,
        choices=EducationType.choices,
        default=EducationType.OFFLINE,
        verbose_name="Ta'lim turi",
    )
    day_type = models.CharField(
        max_length=20,
        choices=DayType.choices,
        default=DayType.EVERYDAY,
        verbose_name="Dars kunlari turi",
    )
    days = models.CharField(max_length=255, blank=True, null=True, verbose_name="Kunlarni yozing")
    telegram_link = models.URLField(blank=True, null=True, verbose_name="Telegram guruh havolasi")
    room = models.ForeignKey(
        "Room", on_delete=models.SET_NULL, null=True, blank=True, related_name="groups", verbose_name="Xona"
    )
    teacher = models.ForeignKey(
        "Employee", on_delete=models.SET_NULL, null=True, blank=True, related_name="teacher_groups", verbose_name="O'qituvchi"
    )
    lesson_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="1 dars narxi")
    start_date = models.DateField(null=True, blank=True, verbose_name="Boshlanish sanasi")
    end_date = models.DateField(null=True, blank=True, verbose_name="Tugash sanasi")
    created_at = models.DateTimeField(auto_now_add=True)

    def is_ending_soon(self):
        if not self.end_date:
            return False
        remaining = (self.end_date - date.today()).days
        return 0 <= remaining <= 10

    def remaining_days(self):
        if not self.end_date:
            return None
        return (self.end_date - date.today()).days

    def is_date_overdue(self):
        if not self.end_date:
            return False
        return self.end_date < date.today()

    @property
    def frozen_students_count(self):
        return self.students.filter(frozen_until__gte=date.today()).count()

    def __str__(self):
        return f"{self.name} ({self.course.name})"

    class Meta:
        verbose_name = "Guruh"
        verbose_name_plural = "Guruhlar"


class Student(models.Model):
    class Status(models.TextChoices):
        PENDING = "kutilyotgan", "Kutilyotgan"
        REMOVED = "chiqarilgan", "Chiqarilgan"

    user = models.OneToOneField(
        "auth.User", on_delete=models.CASCADE, null=True, blank=True,
        related_name="student_profile", verbose_name="Foydalanuvchi"
    )
    first_name = models.CharField(max_length=255, verbose_name="Ism")
    last_name = models.CharField(max_length=255, verbose_name="Familya")
    phone = models.CharField(max_length=20, verbose_name="Telefon raqam")
    groups = models.ManyToManyField(Group, blank=True, related_name="students", verbose_name="Guruhlar")
    graduated_groups = models.ManyToManyField(
        Group, blank=True, related_name="graduated_students", verbose_name="Bitirilgan guruhlar"
    )
    desired_course = models.ForeignKey(
        Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="interested_students", verbose_name="Qiziqqan kursi"
    )
    frozen_until = models.DateField(null=True, blank=True, verbose_name="Muzlatish tugash sanasi")
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name="Holati",
    )
    birth_date = models.DateField(null=True, blank=True, verbose_name="Tug'ilgan sana")
    marketing_survey = models.ForeignKey(
        MarketingSurvey,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="students",
        verbose_name="Marketing so'rovnoma",
    )
    additional_info = models.TextField(blank=True, null=True, verbose_name="Qo'shimcha ma'lumotlar")
    father_full_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Otasining ism familya")
    father_phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Otasining nomeri")
    mother_full_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Onasining ism familya")
    mother_phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Onasining nomeri")
    telegram_chat_id = models.CharField(max_length=50, blank=True, null=True, verbose_name="Telegram chat ID")
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_frozen(self):
        if not self.frozen_until:
            return False
        return self.frozen_until >= date.today()

    @property
    def frozen_remaining_days(self):
        if not self.frozen_until:
            return 0
        remaining = (self.frozen_until - date.today()).days
        return max(remaining, 0)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        verbose_name = "O'quvchi"
        verbose_name_plural = "O'quvchilar"


class LessonTime(models.Model):
    DAY_CHOICES = [
        ("dushanba", "Dushanba"),
        ("seshanba", "Seshanba"),
        ("chorshanba", "Chorshanba"),
        ("payshanba", "Payshanba"),
        ("juma", "Juma"),
        ("shanba", "Shanba"),
        ("yakshanba", "Yakshanba"),
    ]

    DAY_ORDER = {d[0]: i for i, d in enumerate(DAY_CHOICES)}

    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="lesson_times", verbose_name="Guruh"
    )
    days = models.CharField(max_length=255, verbose_name="Hafta kunlari")
    start_time = models.TimeField(verbose_name="Boshlanish vaqti")
    end_time = models.TimeField(verbose_name="Tugash vaqti")

    def get_days_display(self):
        day_map = dict(self.DAY_CHOICES)
        selected = [d.strip() for d in self.days.split(",") if d.strip()]
        return ", ".join(day_map.get(d, d) for d in selected)

    def __str__(self):
        return f"{self.get_days_display()} {self.start_time.strftime('%H:%M')}-{self.end_time.strftime('%H:%M')}"

    class Meta:
        verbose_name = "Dars vaqti"
        verbose_name_plural = "Dars vaqtlari"
        ordering = ["start_time"]


class StudentLog(models.Model):
    class Action(models.TextChoices):
        JOINED = "joined", "Guruhga qo'shildi"
        REMOVED = "removed", "Guruhdan chiqarildi"
        FROZEN = "frozen", "Muzlatildi"
        UNFROZEN = "unfrozen", "Muzlatish bekor qilindi"

    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name="logs", verbose_name="O'quvchi"
    )
    group = models.ForeignKey(
        Group, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Guruh"
    )
    action = models.CharField(max_length=20, choices=Action.choices, verbose_name="Harakat")
    reason = models.TextField(blank=True, null=True, verbose_name="Sabab")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.get_action_display()}"

    class Meta:
        verbose_name = "O'quvchi harakati"
        verbose_name_plural = "O'quvchi harakatlari"
        ordering = ["-created_at"]


class GroupLog(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="logs", verbose_name="Guruh")
    action = models.CharField(max_length=50, verbose_name="Harakat")
    description = models.TextField(verbose_name="Tavsif")
    created_by = models.CharField(max_length=255, blank=True, default="", verbose_name="Kim tomonidan")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.group.name} - {self.action}"

    class Meta:
        verbose_name = "Guruh tarixi"
        verbose_name_plural = "Guruh tarixlari"
        ordering = ["-created_at"]


class Branch(models.Model):
    name = models.CharField(max_length=255, verbose_name="Filial nomi")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Filial"
        verbose_name_plural = "Filiallar"


class Room(models.Model):
    name = models.CharField(max_length=255, verbose_name="Xona nomi")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Xona"
        verbose_name_plural = "Xonalar"


class Role(models.Model):
    name = models.CharField(max_length=255, verbose_name="Rol nomi")
    level = models.CharField(max_length=50, blank=True, null=True, verbose_name="Daraja")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Rol"
        verbose_name_plural = "Rollar"


class Position(models.Model):
    name = models.CharField(max_length=255, verbose_name="Vazifa nomi")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Vazifa"
        verbose_name_plural = "Vazifalar"


class Employee(models.Model):
    class Gender(models.TextChoices):
        MALE = "erkak", "Erkak"
        FEMALE = "ayol", "Ayol"

    user = models.OneToOneField(
        "auth.User", on_delete=models.CASCADE, null=True, blank=True,
        related_name="employee_profile", verbose_name="Foydalanuvchi"
    )
    first_name = models.CharField(max_length=255, verbose_name="Ism")
    last_name = models.CharField(max_length=255, verbose_name="Familiya")
    phone = models.CharField(max_length=20, verbose_name="Telefon raqam")
    email = models.EmailField(blank=True, null=True, verbose_name="Elektron pochta")
    gender = models.CharField(max_length=10, choices=Gender.choices, blank=True, null=True, verbose_name="Jinsi")
    birth_date = models.DateField(blank=True, null=True, verbose_name="Tug'ilgan sanasi")
    position = models.ForeignKey(Position, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Vazifasi")
    photo = models.ImageField(upload_to="employees/", blank=True, null=True, verbose_name="Profil rasmi")
    salary_enabled = models.BooleanField(default=False, verbose_name="Ish haqi chiqarish")
    branches = models.ManyToManyField(Branch, blank=True, verbose_name="Filiallar")
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Rol")
    salary_same = models.BooleanField(default=False, verbose_name="Hammaga bir xil")
    salary = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, verbose_name="Ish haqi")
    notes = models.TextField(blank=True, null=True, verbose_name="Izoh")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        verbose_name = "Xodim"
        verbose_name_plural = "Xodimlar"


class Attendance(models.Model):
    class Status(models.TextChoices):
        PRESENT = "present", "Keldi"
        ABSENT = "absent", "Kelmadi"
        EXCUSED = "excused", "Sababli kelmadi"

    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="attendances", verbose_name="Guruh")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="attendances", verbose_name="O'quvchi")
    lesson_time = models.ForeignKey("LessonTime", on_delete=models.CASCADE, related_name="attendances", verbose_name="Dars vaqti", null=True, blank=True)
    date = models.DateField(verbose_name="Sana")
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.PRESENT, verbose_name="Holati")
    teacher = models.ForeignKey("Employee", on_delete=models.CASCADE, related_name="attendances", verbose_name="O'qituvchi", null=True, blank=True)
    created_by = models.CharField(max_length=255, blank=True, default="", verbose_name="Kim tomonidan")
    notes = models.TextField(verbose_name="Izoh", blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Davomat"
        verbose_name_plural = "Davomatlar"
        unique_together = ("group", "student", "date")

    def __str__(self):
        return f"{self.student} - {self.date} - {self.get_status_display()}"


class AbsenceReason(models.Model):
    class ReasonType(models.TextChoices):
        ABSENT = "absent", "Kelmadi"
        EXCUSED = "excused", "Sababli kelmadi"
        BOTH = "both", "Ikkalasi"

    name = models.CharField(max_length=255, verbose_name="Sabab nomi")
    reason_type = models.CharField(max_length=10, choices=ReasonType.choices, default=ReasonType.BOTH, verbose_name="Turi")
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Davomat sababi"
        verbose_name_plural = "Davomat sabablari"
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class VerificationCode(models.Model):
    phone = models.CharField(max_length=20, verbose_name="Telefon raqam")
    code = models.CharField(max_length=128, verbose_name="Tasdiqlash kodi")
    is_used = models.BooleanField(default=False, verbose_name="Ishlatilgan")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Tasdiqlash kodi"
        verbose_name_plural = "Tasdiqlash kodlari"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.phone} - {self.code}"


class StudentLessonPrice(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="lesson_prices", verbose_name="O'quvchi")
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="student_lesson_prices", verbose_name="Guruh")
    lesson_price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Shaxsiy dars narxi")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "O'quvchi shaxsiy narxi"
        verbose_name_plural = "O'quvchi shaxsiy narxlari"
        unique_together = ("student", "group")

    def __str__(self):
        return f"{self.student} - {self.group} - {self.lesson_price}"


class StudentBalance(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name="balance", verbose_name="O'quvchi")
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'), verbose_name="Balans")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "O'quvchi balansi"
        verbose_name_plural = "O'quvchi balanslari"

    def __str__(self):
        return f"{self.student} - {self.balance} so'm"


class Transaction(models.Model):
    class Type(models.TextChoices):
        PAYMENT = "payment", "To'lov"
        LESSON = "lesson", "Dars uchun yechildi"
        CORRECTION = "correction", "Tuzatish"

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="transactions", verbose_name="O'quvchi")
    amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Summa")
    balance_after = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Operatsiyadan keyingi balans")
    transaction_type = models.CharField(max_length=20, choices=Type.choices, verbose_name="Operatsiya turi")
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True, related_name="transactions", verbose_name="Guruh")
    attendance = models.ForeignKey("Attendance", on_delete=models.SET_NULL, null=True, blank=True, related_name="transactions", verbose_name="Davomat")
    payment_method = models.CharField(max_length=20, blank=True, default="", verbose_name="To'lov usuli")
    description = models.TextField(blank=True, null=True, verbose_name="Izoh")
    created_by = models.CharField(max_length=255, blank=True, default="", verbose_name="Kim tomonidan")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Tranzaksiya"
        verbose_name_plural = "Tranzaksiyalar"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.student} - {self.amount} ({self.get_transaction_type_display()})"


class ReceiptTemplate(models.Model):
    name = models.CharField(max_length=255, verbose_name="Template nomi")
    is_default = models.BooleanField(default=False, verbose_name="Standart")
    width = models.CharField(max_length=10, default="80mm", choices=[("58mm", "58 mm"), ("80mm", "80 mm")], verbose_name="Eni")
    height_mode = models.CharField(max_length=10, default="auto", choices=[("auto", "Avtomatik"), ("custom", "Maxsus")], verbose_name="Balandlik rejimi")
    height = models.PositiveIntegerField(default=300, verbose_name="Balandlik (mm)")
    paper_margin = models.PositiveIntegerField(default=0, verbose_name="Qog'oz cheti (mm)")
    background_color = models.CharField(max_length=7, default="#ffffff", verbose_name="Fon rangi")
    print_dpi = models.PositiveIntegerField(default=203, verbose_name="Chop etish DPI")
    thermal_mode = models.BooleanField(default=False, verbose_name="Termal printer rejimi")
    black_white = models.BooleanField(default=True, verbose_name="Qora-oq rejim")
    page_padding = models.PositiveIntegerField(default=10, verbose_name="Sahifa ichki cheti (px)")
    components = models.JSONField(default=list, blank=True, verbose_name="Komponentlar")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Chek shabloni"
        verbose_name_plural = "Chek shablonlari"

    def save(self, *args, **kwargs):
        if self.is_default:
            ReceiptTemplate.objects.filter(is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class GlobalConfig(models.Model):
    deduct_absent = models.BooleanField(default=False, verbose_name="Sababsiz kelmaganlardan pul yechish")
    deduct_excused = models.BooleanField(default=False, verbose_name="Sababli kelmaganlardan pul yechish")

    class Meta:
        verbose_name = "Global sozlama"
        verbose_name_plural = "Global sozlamalar"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_instance(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return f"Global sozlamalar (abs={self.deduct_absent}, exc={self.deduct_excused})"
