import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain() {
  const items = [
    {
      title: "lorem ipsum dolor sit amet consectetur adipiscing elit",
      url: "/notes",
      emoji: "🔥",
      isActive: true,
    },
  ] as any[];
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Notes</SidebarGroupLabel>
      {items.length ? (
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  <span className="text-medium">{item.emoji}</span>
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      ) : (
        <p className="text-small text-center py-9 text-foreground-500">
          No notes yet, click the button above to create one
        </p>
      )}
    </SidebarGroup>
  );
}
