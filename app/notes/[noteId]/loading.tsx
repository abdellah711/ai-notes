"use client";
import { Skeleton } from "@nextui-org/react";

export default function NoteLoading() {
  return (
    <div className="size-full px-12 sm:px-[max(30px,calc(50%-350px))]">
      <div className="flex mt-4 mb-2">
        <Skeleton className="size-12 rounded-lg" />
        <Skeleton className="w-1/4 ms-auto h-3.5 rounded-md" />
      </div>
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
