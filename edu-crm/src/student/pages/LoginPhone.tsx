import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { api } from "../api"

export default function LoginPhone() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [focused, setFocused] = useState(false)
  const [showTelegram, setShowTelegram] = useState(false)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "")
    if (val.length > 9) val = val.slice(0, 9)
    let f = ""
    if (val.length > 0) f = val.slice(0, 2)
    if (val.length > 2) f += " " + val.slice(2, 5)
    if (val.length > 5) f += " " + val.slice(5, 7)
    if (val.length > 7) f += " " + val.slice(7, 9)
    setPhone(f)
    if (error) setError("")
  }


  const handleSubmit = async () => {
    const raw = phone.replace(/\s/g, "")
    if (raw.length !== 9) {
      setError("Telefon raqamni to'liq kiriting")
      return
    }
    setLoading(true)
    try {
      const full = "+998" + raw
      const res = await api.sendCode(full)
      if (!res.telegram_connected) {
        setShowTelegram(true)
        return
      }
      navigate("/verify-code", { state: { phone: full } })
    } catch (err: any) {
      setError(err.message || "Xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#111827] select-none relative overflow-hidden flex items-center justify-center">

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-[0.04]" style={{ background: "radial-gradient(circle, #2001FF 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full -translate-x-1/3 translate-y-1/3 opacity-[0.03]" style={{ background: "radial-gradient(circle, #2001FF 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-[420px] mx-auto px-6 py-8 flex flex-col min-h-screen sm:min-h-0 sm:py-0 sm:justify-center">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-12 shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-gray-400" />
          </button>
          <span className="text-gray-300 text-[10px] font-bold uppercase tracking-[2px]">IT House Superapp</span>
          <div className="w-9" />
        </div>

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-[#111827] font-bold text-[28px] leading-[1.25] tracking-[-0.5px]">
            Tizimga kirish uchun
            <br />
            maydonlarni to'ldiring.
          </h1>
        </div>

        {/* Label */}
        <label className="text-gray-400 text-[11px] font-semibold uppercase tracking-[1.5px] mb-3 block">
          Telefon raqami
        </label>

        {/* Phone input */}
        <div
          className={`flex items-center rounded-xl px-4 h-14 border transition-all duration-200 ${
            focused
              ? "border-[#2001FF] shadow-[0_0_0_3px_rgba(32,1,255,0.08)]"
              : error
                ? "border-red-300 bg-red-50/30"
                : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
        >
          <svg viewBox="0 0 24 16" className="w-6 h-4 rounded-[2px] shrink-0">
            <rect width="24" height="16" rx="1" fill="#1EB53A" />
            <rect width="24" height="5.33" fill="#0099B5" />
            <rect y="5.33" width="24" height="5.34" fill="white" />
            <rect y="5.33" width="24" height="0.67" fill="#CE1126" />
            <rect y="10" width="24" height="0.67" fill="#CE1126" />
            <rect y="10.67" width="24" height="5.33" fill="#1EB53A" />
            <g fill="white" transform="translate(2,0.8)">
              <path d="M2.2 3.5 A1.8 1.8 0 0 0 2.2 0.5 A2.2 2.2 0 0 1 3.2 3.5 A2.2 2.2 0 0 1 2.2 6.5 A1.8 1.8 0 0 0 2.2 3.5z" />
              <circle cx="5" cy="0.8" r="0.4" />
              <circle cx="6.2" cy="1.2" r="0.35" />
              <circle cx="6.8" cy="2.3" r="0.35" />
              <circle cx="6.2" cy="3.4" r="0.35" />
              <circle cx="5" cy="3.8" r="0.35" />
              <circle cx="3.8" cy="3.4" r="0.35" />
              <circle cx="3.2" cy="2.3" r="0.35" />
              <circle cx="3.8" cy="1.2" r="0.35" />
              <circle cx="6.8" cy="0.8" r="0.28" />
              <circle cx="7.2" cy="1.2" r="0.28" />
              <circle cx="7.2" cy="2.8" r="0.28" />
              <circle cx="6.8" cy="3.4" r="0.28" />
            </g>
          </svg>
          <span className="text-gray-700 text-sm font-semibold ml-3 mr-2 shrink-0">+998</span>
          <div className="w-px h-4 bg-gray-200 shrink-0" />
          <input
            type="tel"
            className={`flex-1 bg-transparent text-[#111827] text-base font-medium ml-3 outline-none placeholder:text-gray-300 tracking-[0.3px] ${focused ? "text-[#111827]" : ""}`}
            placeholder="00 000 00 00"
            value={phone}
            onChange={handleInput}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-[5px] h-[5px] rounded-full bg-red-400 shrink-0" />
            <span className="text-red-500 text-xs font-medium">{error}</span>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading || phone.replace(/\s/g, "").length !== 9}
          className="mt-6 w-full h-14 rounded-2xl text-white text-base font-bold bg-[#2001FF] shadow-[0_8px_25px_-5px_rgba(32,1,255,0.35)] transition-all duration-300 active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none hover:shadow-[0_12px_30px_-5px_rgba(32,1,255,0.45)]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
              <span className="text-white/80 font-medium">Yuborilmoqda...</span>
            </div>
          ) : (
            "Davom etish"
          )}
        </button>

        {/* Telegram prompt */}
        {showTelegram && (
          <div className="mt-5 p-4 rounded-2xl bg-[#F0F0FF] border border-[#2001FF]/10">
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#2001FF" className="mt-0.5 shrink-0">
                <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              <div>
                <p className="text-[#111827] text-sm font-semibold mb-1">Telegram'ga ulaning</p>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">
                  Kodni Telegram'ingizda olish uchun <span className="font-semibold text-[#2001FF]">@ithousekuy_bot</span> ga o'ting va telefon raqamingizni yuboring.
                </p>
                <div className="flex gap-2">
                  <a
                    href="https://t.me/ithousekuy_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2001FF] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    Botga o'tish
                  </a>
                  <button
                    onClick={() => navigate("/password-login")}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Parol orqali kirish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-col items-center gap-4 mt-6">
          <button className="text-[#2001FF] text-sm font-medium hover:opacity-80 transition-opacity">
            Parolni unutdingizmi?
          </button>
          <button
            onClick={() => navigate("/password-login")}
            className="text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
          >
            Username orqali kirish
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-8 shrink-0">
          <ShieldCheck size={14} className="text-gray-300 shrink-0" />
          <p className="text-gray-300 text-[11px] font-medium text-center leading-relaxed">
            Ma'lumotlaringiz xavfsiz saqlanadi va uchinchi shaxslarga berilmaydi
          </p>
        </div>

      </div>
    </div>
  )
}
