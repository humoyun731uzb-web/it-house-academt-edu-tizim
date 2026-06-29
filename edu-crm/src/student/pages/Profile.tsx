import { useState, useEffect } from "react"
import {
  ChevronRight, Copy, Menu, Building2, CreditCard,
  Award, Settings, MessageCircle, Heart,
} from "lucide-react"
import { api } from "../api"
import { useDrawer } from "../context/DrawerContext"
import type { StudentProfile, GroupInfo } from "../types"

const menuSections = [
  {
    items: [
      { icon: Building2, label: "Filial", color: "text-[#2001FF]", bg: "bg-[#2001FF]/10" },
      { icon: CreditCard, label: "To'lovlar", color: "text-green-600", bg: "bg-green-50" },
      { icon: Award, label: "Sertifikatlar", color: "text-yellow-600", bg: "bg-yellow-50" },
    ],
  },
  {
    items: [
      { icon: Copy, label: "User ID nusxalash", color: "text-gray-600", bg: "bg-gray-50" },
      { icon: Copy, label: "Branch ID nusxalash", color: "text-gray-600", bg: "bg-gray-50" },
    ],
  },
  {
    items: [
      { icon: Settings, label: "Sozlamalar", color: "text-gray-700", bg: "bg-gray-50" },
      { icon: MessageCircle, label: "Takliflar", color: "text-indigo-500", bg: "bg-indigo-50" },
      { icon: Heart, label: "Do'stni taklif qilish", color: "text-rose-500", bg: "bg-rose-50" },
    ],
  },
]

export default function Profile() {
  const { open: openDrawer } = useDrawer()
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [groups, setGroups] = useState<GroupInfo[]>([])

  useEffect(() => {
    api.profile().then((res) => {
      setStudent(res.student)
      setGroups(res.groups)
    }).catch(() => {})
  }, [])

  if (!student) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2001FF]/30 border-t-[#2001FF] rounded-full animate-spin" />
      </div>
    )
  }

  const initials = (student.first_name?.charAt(0) || "") + (student.last_name?.charAt(0) || "")

  return (
    <div className="min-h-screen bg-[#F8F9FC] pb-24 animate-page-enter">
      <div className="max-w-lg mx-auto px-4 pt-12">
        <header className="flex items-center justify-between mb-5">
          <button
            onClick={openDrawer}
            className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm btn-hover"
          >
            <Menu size={20} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Profil</h1>
          <div className="w-10 h-10" />
        </header>

        <section className="mb-5 animate-scale-in">
          <div className="card-premium p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-[#2001FF] to-[#4361FF] rounded-[20px] flex items-center justify-center shadow-lg shadow-[#2001FF]/20">
                  <span className="text-2xl font-bold text-white">{initials || "O"}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900">
                  {student.first_name} {student.last_name}
                </h2>
                <p className="text-sm font-medium text-gray-400 mt-0.5">{student.phone}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-2.5 py-1 bg-[#2001FF]/10 rounded-lg">
                    <span className="text-[11px] font-bold text-[#2001FF]">450 000 so'm</span>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400">Balans</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300" />
            </div>
          </div>
        </section>

        {menuSections.map((section, secIdx) => (
          <section key={secIdx} className="mb-4 animate-scale-in" style={{ animationDelay: `${(secIdx + 1) * 80}ms` }}>
            <div className="card-premium divide-y divide-gray-50 overflow-hidden">
              {section.items.map((item, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center justify-between px-5 py-4 btn-hover hover:bg-gray-50/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${item.bg} flex items-center justify-center`}>
                      <item.icon size={18} className={item.color} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                  </div>
                  {item.label.includes("nusxalash") ? (
                    <Copy size={14} className="text-gray-300" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </section>
        ))}

        {groups.length > 0 && (
          <section className="mb-5 animate-scale-in stagger-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Guruhlarim</h3>
            <div className="space-y-2.5">
              {groups.map((g, idx) => {
                const colors = [
                  "from-[#2001FF] to-[#4361FF]",
                  "from-emerald-400 to-emerald-500",
                  "from-violet-400 to-violet-500",
                  "from-amber-400 to-amber-500",
                ]
                return (
                  <div key={g.id} className="card-premium-sm p-4 flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center shrink-0 shadow-sm`}>
                      <span className="text-base font-bold text-white">{g.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{g.name}</p>
                      <p className="text-[11px] font-medium text-gray-400 mt-0.5">{g.course}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-semibold text-gray-500">{g.teacher}</p>
                      <p className="text-[11px] font-medium text-gray-400">{g.room}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
