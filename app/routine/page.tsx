"use client";

import { Button } from "@/components/ui/button";
import { Folder, MoreHorizontal, Plus, Search, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type MuscleFilter = "전체" | "가슴" | "등" | "하체" | "어깨";

type Routine = {
  id: string;
  title: string;
  tags: string[]; // 예: ["등", "이두"]
  lastDoneText: string; // 예: "2일 전 수행"
};

const FILTERS: MuscleFilter[] = ["전체", "가슴", "등", "하체", "어깨"];

export default function RoutinePage() {
  const router = useRouter();

  // ✅ mock data (나중에 API로 교체)
  const [routines, setRoutines] = useState<Routine[]>([
    {
      id: "r1",
      title: "4분할 등/이두",
      tags: ["등", "이두"],
      lastDoneText: "2일 전 수행",
    },
    {
      id: "r2",
      title: "가슴/삼두 집중",
      tags: ["가슴", "삼두"],
      lastDoneText: "5일 전 수행",
    },
    {
      id: "r3",
      title: "하체 킬러",
      tags: ["하체"],
      lastDoneText: "1주 전 수행",
    },
    {
      id: "r4",
      title: "어깨/코어",
      tags: ["어깨", "코어"],
      lastDoneText: "3일 전 수행",
    },
  ]);

  const [filter, setFilter] = useState<MuscleFilter>("전체");
  const [query, setQuery] = useState("");

  const visibleRoutines = useMemo(() => {
    const q = query.trim().toLowerCase();

    return routines.filter((r) => {
      const matchesFilter =
        filter === "전체" ? true : r.tags.some((t) => t === filter);

      const matchesQuery =
        q.length === 0
          ? true
          : r.title.toLowerCase().includes(q) ||
            r.tags.some((t) => t.toLowerCase().includes(q));

      return matchesFilter && matchesQuery;
    });
  }, [routines, filter, query]);

  const isEmpty = routines.length === 0;

  return (
    <div className="min-h-screen bg-[#101012] text-white pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#101012]/90 backdrop-blur-xl border-b border-white/5">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">루틴</h1>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // UX: 검색 칩/인풋으로 확장 가능. 지금은 input에 포커스 주는 방식은 ref가 필요해서 생략.
                }}
                className="p-3 rounded-xl hover:bg-white/5 transition-colors"
                aria-label="루틴 검색"
              >
                <Search className="w-6 h-6 text-white/80" />
              </button>

              <button
                onClick={() => router.push("/routine/new")}
                className="p-3 rounded-xl hover:bg-white/5 transition-colors"
                aria-label="루틴 추가"
              >
                <Plus className="w-6 h-6 text-white/80" />
              </button>
            </div>
          </div>

          {/* Search Input (Toss-style, borderless / soft surface) */}
          <div className="mt-4">
            <div className="bg-[#17171C] rounded-2xl px-4 py-3 border border-white/5">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="루틴 이름 또는 태그로 검색"
                className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/40"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 pt-6 space-y-6">
        {/* Filter Chips (Optional / scalable) */}
        {!isEmpty && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-1">
            {FILTERS.map((f) => {
              const active = f === filter;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`shrink-0 min-w-fit px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${
                    active
                      ? "bg-[#3182F6] text-white border-transparent shadow-lg shadow-[#3182F6]/25"
                      : "bg-[#17171C] text-white/70 border-white/10 hover:text-white hover:border-white/20"
                  }`}
                >
                  {f}
                </button>
              );
            })}

            {/* Optional: Folder view entry point */}
            <button
              onClick={() => console.log("[v0] Open folder view")}
              className="shrink-0 min-w-fit px-4 py-2.5 rounded-full text-sm font-medium transition-all bg-[#17171C] text-white/70 border border-white/10 hover:text-white hover:border-white/20 flex items-center gap-2"
            >
              <Folder className="w-4 h-4" />
              폴더
            </button>
          </div>
        )}

        {/* Empty State */}
        {isEmpty ? (
          <div className="bg-[#17171C] rounded-3xl p-8 border border-white/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#3182F6]/15 border border-[#3182F6]/20 flex items-center justify-center flex-shrink-0">
                <Tag className="w-6 h-6 text-[#3182F6]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">
                  아직 만든 루틴이 없어요.
                </h2>
                <p className="text-sm text-white/60 leading-relaxed mb-6">
                  첫 루틴을 만들어두면 운동 기록이 훨씬 빨라져요.
                </p>

                <Button
                  onClick={() => router.push("/routine/new")}
                  className="w-full h-14 rounded-2xl bg-[#3182F6] hover:bg-[#2563EB] text-white font-bold text-base shadow-xl shadow-[#3182F6]/25"
                >
                  루틴 만들기
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* My Routines Section */}
            <section className="space-y-3">
              <div className="flex items-end justify-between px-1">
                <div>
                  <h2 className="text-lg font-bold">내 루틴</h2>
                  <p className="text-sm text-white/50 mt-1">
                    자주 하는 루틴을 빠르게 시작하세요
                  </p>
                </div>

                <span className="text-sm text-white/40">
                  {visibleRoutines.length}개
                </span>
              </div>

              {/* Routine Cards */}
              <div className="space-y-3">
                {visibleRoutines.map((r) => (
                  <div
                    key={r.id}
                    className="bg-[#17171C] rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <button
                        onClick={() => router.push(`/routine/${r.id}`)}
                        className="text-left flex-1"
                      >
                        <h3 className="text-lg font-bold leading-tight">
                          {r.title}
                        </h3>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {r.tags.map((t) => (
                            <span
                              key={`${r.id}-${t}`}
                              className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/70 border border-white/10"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>

                        <p className="text-sm text-white/50 mt-4">
                          {r.lastDoneText}
                        </p>
                      </button>

                      {/* "..." menu */}
                      <button
                        onClick={() => console.log("[v0] routine menu:", r.id)}
                        className="p-3 rounded-xl hover:bg-white/5 transition-colors"
                        aria-label="루틴 메뉴"
                      >
                        <MoreHorizontal className="w-6 h-6 text-white/60" />
                      </button>
                    </div>

                    {/* Primary action row (optional but nice for speed) */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <Button
                        onClick={() =>
                          router.push(`/workout?routineId=${r.id}`)
                        }
                        className="h-14 rounded-2xl bg-[#3182F6] hover:bg-[#2563EB] text-white font-bold"
                      >
                        바로 시작
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/routine/${r.id}/edit`)}
                        className="h-14 rounded-2xl border-white/10 text-white/80 hover:bg-white/5 bg-transparent"
                      >
                        편집
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* No results after filter/search */}
              {visibleRoutines.length === 0 && (
                <div className="bg-[#17171C] rounded-3xl p-6 border border-white/5">
                  <p className="text-sm text-white/60">
                    조건에 맞는 루틴이 없어요.
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setQuery("");
                        setFilter("전체");
                      }}
                      className="rounded-2xl border-white/10 text-white/80 hover:bg-white/5 bg-transparent"
                    >
                      필터 초기화
                    </Button>
                    <Button
                      onClick={() => router.push("/routine/new")}
                      className="rounded-2xl bg-[#3182F6] hover:bg-[#2563EB] text-white font-bold"
                    >
                      루틴 만들기
                    </Button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
