"use client";
import { Skeleton } from "@nextui-org/react";

export default function NoteLoading() {
  return (
    <div className="size-full text-base sm:px-[max(30px,calc(50%-350px))]">
      <Skeleton className="w-1/4 ms-auto h-3.5 mt-10 mb-2 rounded-md" />
      <Skeleton className="w-1/2 h-9 mb-9 rounded-md" />
      {new Array(3).fill(0).map((_, i) => (
        <div key={i} className="mb-4">
          <Skeleton className="h-6 rounded-md mb-2" />
          <Skeleton className="h-6 rounded-md mb-2" />
          <Skeleton className="w-1/2 h-6 rounded-md" />
        </div>
      ))}
    </div>
  );
}
