import { SidebarTrigger } from "@/components/ui/sidebar";

type Props = {};

export default function NotesHomePage({}: Props) {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
      </header>
    </div>
  );
}
