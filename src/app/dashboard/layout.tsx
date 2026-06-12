import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WhatsAppBubble } from "@/components/whatsapp-bubble";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="user">
      {children}
      <WhatsAppBubble />
    </DashboardShell>
  );
}
