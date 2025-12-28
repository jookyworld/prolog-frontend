"use client";

import { BottomNav } from "@/components/bottom-nav";
import { RoutineBottomSheet } from "@/components/routine-bottom-sheet";
import { Analytics } from "@vercel/analytics/next";
import { useState } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  return (
    <html lang="ko">
      <body className="font-sans antialiased bg-[#101012] text-white">
        {/* ✅ 하단바에 가리지 않도록 공통 padding-bottom */}
        <main className="min-h-screen pt-safe pb-24">{children}</main>

        {/* ✅ 공통 하단바 */}
        <BottomNav onWorkoutClick={() => setIsBottomSheetOpen(true)} />

        {/* ✅ 공통 바텀 시트 */}
        <RoutineBottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          onSelectRoutine={(id) => {
            console.log("Selected:", id);
            setIsBottomSheetOpen(false);
          }}
        />

        <Analytics />
      </body>
    </html>
  );
}
