from django.contrib import admin
from .models import Course, MarketingSurvey, Group, Student, LessonTime, StudentLog, Branch, Room, Role, Position, Employee, Attendance, AbsenceReason, GroupLog, VerificationCode, StudentBalance, Transaction, StudentLessonPrice, GlobalConfig, ReceiptTemplate

admin.site.register(Course)
admin.site.register(MarketingSurvey)
admin.site.register(Group)
admin.site.register(Student)
admin.site.register(LessonTime)
admin.site.register(StudentLog)
admin.site.register(Branch)
admin.site.register(Room)
admin.site.register(Role)
admin.site.register(Position)
admin.site.register(Employee)
admin.site.register(Attendance)
admin.site.register(AbsenceReason)
admin.site.register(GroupLog)
admin.site.register(VerificationCode)
admin.site.register(StudentBalance)
admin.site.register(StudentLessonPrice)
admin.site.register(GlobalConfig)


admin.site.register(ReceiptTemplate)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ["student", "amount", "transaction_type", "balance_after", "created_at"]
    list_filter = ["transaction_type", "created_at"]
    search_fields = ["student__first_name", "student__last_name"]
