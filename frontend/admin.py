from django.contrib import admin
from .models import Course, MarketingSurvey, Group, Student, LessonTime, StudentLog, Branch, Room, Role, Position, Employee, Attendance, AbsenceReason, VerificationCode

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
admin.site.register(VerificationCode)
