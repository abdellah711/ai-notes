import { Button } from "@nextui-org/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center pt-[30vh] gap-5">
      <h1 className="text-5xl font-semibold text-foreground">AI Notes</h1>
      <p className="text-foreground-600 text-medium">
        Capture and organize your notes like never before with AI
      </p>
      <Button color="primary" as={Link} href={"/login"}>
        Get Started 🚀
      </Button>
    </main>
  );
}
