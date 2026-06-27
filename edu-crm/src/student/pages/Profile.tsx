import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  User, Phone, BookOpen, ChevronRight, LogOut, Shield, Star,
  CalendarDays, ChevronLeft,
} from "lucide-react"
import { api } from "../api"
import type { StudentProfile, GroupInfo } from "../types"

export default function Profile() {
  const navigate = useNavigate()
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [groups, setGroups] = useState<GroupInfo[]>([])

  useEffect(() => {
    api.profile().then((res) => {
      setStudent(res.student)
      setGroups(res.groups)
    }).catch(() => {})
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("student_token")
    navigate("/")
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2001FF]/30 border-t-[#2001FF] rounded-full animate-spin" />
      </div>
    )
  }

  const initials = (student.first_name?.charAt(0) || "") + (student.last_name?.charAt(0) || "")

  const menuItems = [
    { icon: Shield, label: "Parolni o'zgartirish", color: "text-[#2001FF]", bg: "bg-[#2001FF]/10" },
    { icon: Star, label: "Baholarim", color: "text-yellow-500", bg: "bg-yellow-50" },
    { icon: CalendarDays, label: "Davomat tarixi", color: "text-green-500", bg: "bg-green-50", path: "/attendance-history" },
  ]

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-24 page-enter">
      <div className="max-w-lg mx-auto px-4 pt-14">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-5 transition-all font-medium"
        >
          <ChevronLeft size={18} />
          Home
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-[22px] p-6 text-center mb-4 card-shadow animate-scale-in">
          <div className="relative inline-block mb-3">
            <div className="w-24 h-24 bg-gradient-to-br from-[#2001FF] to-[#4361FF] rounded-full flex items-center justify-center mx-auto shadow-xl shadow-[#2001FF]/20">
              <span className="text-3xl font-bold text-white">{initials || "O"}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-2 border-white rounded-full flex items-center justify-center shadow-md">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            {student.first_name} {student.last_name}
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500 mt-1.5 font-medium">
            <Phone size={14} />
            {student.phone}
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-[22px] p-5 card-shadow mb-4 animate-fade-in">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Shaxsiy ma'lumotlar</h3>
          <div className="space-y-3">
            {student.birth_date && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[16px]">
                <div className="p-2 bg-orange-50 rounded-xl">
                  <CalendarDays size={16} className="text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tug'ilgan sana</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{student.birth_date}</p>
                </div>
              </div>
            )}
            {student.father_full_name && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[16px]">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <User size={16} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Ota</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{student.father_full_name}</p>
                </div>
                {student.father_phone && (
                  <span className="text-xs font-medium text-gray-400">{student.father_phone}</span>
                )}
              </div>
            )}
            {student.mother_full_name && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[16px]">
                <div className="p-2 bg-pink-50 rounded-xl">
                  <User size={16} className="text-pink-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Ona</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{student.mother_full_name}</p>
                </div>
                {student.mother_phone && (
                  <span className="text-xs font-medium text-gray-400">{student.mother_phone}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Groups */}
        {groups.length > 0 && (
          <div className="bg-white rounded-[22px] p-5 card-shadow mb-4 animate-fade-in">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen size={16} className="text-[#2001FF]" />
              Mening guruhlarim
            </h3>
            <div className="space-y-2">
              {groups.map((g, idx) => {
                const colors = [
                  "from-blue-400 to-blue-500",
                  "from-indigo-400 to-indigo-500",
                  "from-violet-400 to-violet-500",
                  "from-emerald-400 to-emerald-500",
                ]
                return (
                  <div key={g.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-[16px]">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center shrink-0 shadow-sm`}>
                      <span className="text-sm font-bold text-white">{g.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{g.name}</p>
                      <p className="text-[11px] font-medium text-gray-400">{g.course}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-medium text-gray-500">{g.teacher}</p>
                      <p className="text-[11px] font-medium text-gray-400">{g.room}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="bg-white rounded-[22px] card-shadow divide-y divide-gray-50 mb-4 animate-fade-in">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => item.path && navigate(item.path)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-all btn-scale"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${item.bg}`}>
                  <item.icon size={18} className={item.color} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full h-[52px] bg-white border-2 border-red-100 text-red-500 rounded-[18px] font-semibold text-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2 btn-scale"
        >
          <LogOut size={16} />
          Chiqish
        </button>
      </div>
    </div>
  )
}
