import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Bell, BookOpen, Clock, MapPin, TrendingUp, CreditCard,
  CheckCircle2, XCircle, AlertCircle, ChevronRight, Calendar,
  GraduationCap, User,
} from "lucide-react"
import { api } from "../api"

export default function Home() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState<any[]>([])
  const [studentName, setStudentName] = useState("")
  const [studentPhone, setStudentPhone] = useState("")
  const [groupName, setGroupName] = useState("")
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    api.profile().then((res) => {
      setStudentName(res.student.first_name || "O'quvchi")
      setStudentPhone(res.student.phone || "")
      if (res.groups.length > 0) {
        setGroupName(res.groups[0].name || "")
      }
    }).catch(() => {})
    api.todayClasses().then((res) => {
      setClasses(res.classes)
    }).catch(() => {})
    api.attendanceHistory().then(setStats).catch(() => {})
  }, [])

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? "Xayrli tong" : hour < 18 ? "Xayrli kun" : "Xayrli kech"

  const todayClasses = classes || []
  const nextClass = todayClasses.length > 0 ? todayClasses[0] : null
  const upcomingClass = todayClasses.length > 1 ? todayClasses[1] : null

  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    upcoming: { label: "Kutilmoqda", bg: "bg-blue-50", text: "text-blue-600" },
    ongoing: { label: "Davom etmoqda", bg: "bg-green-50", text: "text-green-600" },
    finished: { label: "Tugagan", bg: "bg-gray-50", text: "text-gray-500" },
  }

  const initials = studentName ? studentName.charAt(0).toUpperCase() : "O"

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-24">
      {/* Gradient Header */}
      <div className="gradient-header rounded-b-[35px] px-6 pt-14 pb-8 shadow-lg shadow-[#2001FF]/10">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
              <span className="text-lg font-bold text-white">{initials}</span>
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium">{greeting}</p>
              <p className="text-white font-bold text-base leading-tight">{studentName || "O'quvchi"}</p>
              {groupName && (
                <p className="text-white/60 text-xs font-medium mt-0.5">{groupName}</p>
              )}
            </div>
          </div>
          <div className="relative">
            <button className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/25 transition-all btn-scale">
              <Bell size={20} className="text-white" />
            </button>
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#FF8A00] rounded-full border-2 border-[#2001FF] flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">3</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-4">
        {/* Attendance Card */}
        <div className="bg-white rounded-[22px] p-5 card-shadow card-shadow-hover animate-scale-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Davomat</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.percentage || 0}%</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Shu oy</p>
            </div>
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="#10B981" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(stats?.percentage || 0) / 100 * 263.9} 263.9`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp size={24} className="text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Today's & Next Lesson */}
        <div className="grid grid-cols-2 gap-3">
          {nextClass ? (
            <div className="bg-white rounded-[22px] p-4 card-shadow card-shadow-hover animate-fade-in">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Bugungi dars</span>
              </div>
              <div className="p-2.5 bg-blue-50 rounded-xl w-fit mb-2">
                <BookOpen size={18} className="text-blue-600" />
              </div>
              <p className="text-sm font-bold text-gray-900">{nextClass.subject}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1">
                <Clock size={11} />
                {nextClass.start_time} - {nextClass.end_time}
              </p>
              {nextClass.room && (
                <p className="text-xs text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                  <MapPin size={11} />
                  {nextClass.room}-xona
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-[22px] p-4 card-shadow animate-fade-in">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Bugun</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl w-fit mb-2">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <p className="text-sm font-bold text-gray-900">Dars yo'q</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Dam oling</p>
            </div>
          )}

          {upcomingClass ? (
            <div className="bg-white rounded-[22px] p-4 card-shadow card-shadow-hover animate-fade-in">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Keyingi</span>
              </div>
              <div className="p-2.5 bg-orange-50 rounded-xl w-fit mb-2">
                <BookOpen size={18} className="text-orange-500" />
              </div>
              <p className="text-sm font-bold text-gray-900">{upcomingClass.subject}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1">
                <Clock size={11} />
                {upcomingClass.start_time} - {upcomingClass.end_time}
              </p>
              {upcomingClass.room && (
                <p className="text-xs text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                  <MapPin size={11} />
                  {upcomingClass.room}-xona
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-[22px] p-4 card-shadow animate-fade-in">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Keyingi</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl w-fit mb-2">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <p className="text-sm font-bold text-gray-900">Dars yo'q</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Rejalashtirilmagan</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-900">Statistika</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white rounded-[18px] p-3 text-center card-shadow">
              <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <CheckCircle2 size={16} className="text-green-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">{stats?.present || 0}</p>
              <p className="text-[9px] text-gray-400 font-medium">Kelgan</p>
            </div>
            <div className="bg-white rounded-[18px] p-3 text-center card-shadow">
              <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <XCircle size={16} className="text-red-500" />
              </div>
              <p className="text-lg font-bold text-gray-900">{stats?.absent || 0}</p>
              <p className="text-[9px] text-gray-400 font-medium">Kelmagan</p>
            </div>
            <div className="bg-white rounded-[18px] p-3 text-center card-shadow">
              <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <AlertCircle size={16} className="text-yellow-500" />
              </div>
              <p className="text-lg font-bold text-gray-900">{stats?.excused || 0}</p>
              <p className="text-[9px] text-gray-400 font-medium">Kechikkan</p>
            </div>
            <div className="bg-white rounded-[18px] p-3 text-center card-shadow">
              <div className="w-8 h-8 bg-[#2001FF]/10 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <BookOpen size={16} className="text-[#2001FF]" />
              </div>
              <p className="text-lg font-bold text-gray-900">{stats?.total || 0}</p>
              <p className="text-[9px] text-gray-400 font-medium">Jami</p>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-[22px] p-4 card-shadow card-shadow-hover animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <CreditCard size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400">To'lov holati</p>
                <p className="text-sm font-bold text-green-600">To'langan</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-green-50 rounded-xl">
              <span className="text-xs font-bold text-green-600">✔</span>
            </div>
          </div>
        </div>

        {/* Homework */}
        <div className="bg-white rounded-[22px] p-4 card-shadow card-shadow-hover animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                <BookOpen size={18} className="text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Uy vazifalari</p>
                <p className="text-[10px] text-gray-400 font-medium">3 ta topshiriq</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-[#2001FF] hover:underline" onClick={() => navigate("/homework")}>
              Barchasi
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                <span className="text-xs font-medium text-gray-700">Matematika</span>
              </div>
              <span className="text-[10px] font-semibold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-lg">Kutilmoqda</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-xs font-medium text-gray-700">Ingliz tili</span>
              </div>
              <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">Topshirilgan</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span className="text-xs font-medium text-gray-700">Fizika</span>
              </div>
              <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg">Kechikkan</span>
            </div>
          </div>
        </div>

        {/* Teacher Info */}
        {todayClasses.length > 0 && (
          <div className="bg-white rounded-[22px] p-4 card-shadow card-shadow-hover animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <User size={20} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{todayClasses[0].teacher || "O'qituvchi"}</p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Bugungi dars: {todayClasses[0].subject}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </div>
        )}

        {/* All classes today */}
        {todayClasses.length > 0 && (
          <div className="bg-white rounded-[22px] p-4 card-shadow animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-gray-900">Bugungi barcha darslar</p>
              <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-lg">{todayClasses.length} ta</span>
            </div>
            <div className="space-y-2">
              {todayClasses.map((cls: any, idx: number) => {
                const sc = statusConfig[cls.status]
                return (
                  <div
                    key={cls.id || idx}
                    onClick={() => navigate(`/lesson/${cls.group_id}`)}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer btn-scale"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                        <Clock size={14} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{cls.subject}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{cls.start_time} - {cls.end_time}</p>
                      </div>
                    </div>
                    {sc && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${sc.bg} ${sc.text}`}>
                        {sc.label}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
