"use client"

import { ChevronRight, Home, Dumbbell, Users, User, LayoutGrid, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function ProfilePage() {
  // Volume growth data for chart (last 30 days)
  const volumeData = [
    { day: "1일", volume: 8200 },
    { day: "3일", volume: 8500 },
    { day: "5일", volume: 9100 },
    { day: "8일", volume: 8900 },
    { day: "10일", volume: 9400 },
    { day: "13일", volume: 9800 },
    { day: "15일", volume: 10200 },
    { day: "18일", volume: 10600 },
    { day: "20일", volume: 10400 },
    { day: "23일", volume: 11000 },
    { day: "25일", volume: 11400 },
    { day: "28일", volume: 11800 },
    { day: "30일", volume: 12300 },
  ]

  const menuItems = [
    { title: "운동 기록 보관함", icon: Dumbbell },
    { title: "개인 최고 기록(1RM)", icon: TrendingUp },
    { title: "공유한 루틴 관리", icon: LayoutGrid },
    { title: "설정", icon: User },
  ]

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* User Profile Section */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-black">주권영님</h1>
          <Button
            variant="outline"
            className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-50 h-9 px-5 bg-transparent"
          >
            프로필 보기
          </Button>
        </div>

        {/* Body Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1.5">체중</p>
            <p className="text-2xl font-bold text-black">
              78<span className="text-sm font-normal text-gray-400 ml-0.5">kg</span>
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1.5">골격근량</p>
            <p className="text-2xl font-bold text-black">
              36<span className="text-sm font-normal text-gray-400 ml-0.5">kg</span>
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1.5">체지방률</p>
            <p className="text-2xl font-bold text-black">
              15<span className="text-sm font-normal text-gray-400 ml-0.5">%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Volume Growth Chart Section */}
      <div className="px-6 mb-8">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-black mb-2">이번 달 총 볼륨(Volume) 성장</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#3182F6]">+12.5%</span>
              <span className="text-sm text-gray-500">지난달보다</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[200px] -mx-2 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#999", fontSize: 11 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#999", fontSize: 11 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                  tickLine={false}
                  domain={[7000, 13000]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    padding: "8px 12px",
                  }}
                  labelStyle={{ color: "#666", fontSize: "12px" }}
                  itemStyle={{ color: "#3182F6", fontSize: "14px", fontWeight: "bold" }}
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#3182F6"
                  strokeWidth={3}
                  dot={{ fill: "#3182F6", r: 4 }}
                  activeDot={{ r: 6, fill: "#3182F6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Growth Summary */}
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-700">
              가장 많이 성장한 부위: <span className="font-bold text-[#3182F6]">하체</span>
            </p>
          </div>
        </div>
      </div>

      {/* Menu List Section */}
      <div className="px-6">
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-xl p-2.5">
                  <item.icon className="w-5 h-5 text-gray-700" strokeWidth={2} />
                </div>
                <span className="text-base font-medium text-black">{item.title}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="flex items-center justify-around px-6 py-3 max-w-lg mx-auto">
          <button
            onClick={() => (window.location.href = "/")}
            className="flex flex-col items-center gap-1 py-2 px-4 text-gray-400 hover:text-black transition-colors"
          >
            <Home className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs font-medium">홈</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 px-4 text-gray-400 hover:text-black transition-colors">
            <LayoutGrid className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs font-medium">루틴</span>
          </button>

          {/* Center Button - Elevated */}
          <button className="flex flex-col items-center -mt-8">
            <div className="bg-[#3182F6] hover:bg-[#2563EB] rounded-full p-4 shadow-xl shadow-[#3182F6]/40 transition-all">
              <Dumbbell className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-medium mt-2 text-gray-500">운동</span>
          </button>

          <button className="flex flex-col items-center gap-1 py-2 px-4 text-gray-400 hover:text-black transition-colors">
            <Users className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs font-medium">커뮤니티</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 px-4 text-[#3182F6] transition-colors">
            <User className="w-6 h-6" strokeWidth={2} />
            <span className="text-xs font-medium">내 정보</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
