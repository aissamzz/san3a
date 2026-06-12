import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إنشاء حساب",
  description: "أنشئ حسابك مجاناً في منصة صنعة وجهّز صفحتك الاحترافية خلال دقائق.",
  alternates: { canonical: "/signup" },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
