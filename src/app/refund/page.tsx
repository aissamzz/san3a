import type { Metadata } from "next";

import { BRAND, PRICE_DZD, SUPPORT_EMAIL, SUPPORT_WHATSAPP } from "@/lib/config";
import { LegalPage } from "@/components/public/legal-page";

export const metadata: Metadata = {
  title: "سياسة الاسترجاع",
  description: `سياسة الاسترجاع لمنصة ${BRAND}: استرجاع كامل للمبلغ خلال 7 أيام من تفعيل المفتاح.`,
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <LegalPage title="سياسة الاسترجاع" updated="جوان 2026">
      <section>
        <h2>ضمان الاسترجاع خلال 7 أيام</h2>
        <p>
          نريدك أن تجرّب منصة {BRAND} بثقة تامة. إذا لم تكن راضياً عن الخدمة، يمكنك طلب
          استرجاع كامل لقيمة الاشتراك ({PRICE_DZD} دج) خلال <strong className="text-foreground">7 أيام</strong>{" "}
          من تاريخ تفعيل مفتاحك.
        </p>
      </section>

      <section>
        <h2>شروط الاسترجاع</h2>
        <ul>
          <li>أن يُقدَّم الطلب خلال 7 أيام من تاريخ تفعيل المفتاح في حسابك.</li>
          <li>أن يكون المفتاح قد فُعِّل على حساب واحد فقط.</li>
          <li>يُسترجع المبلغ كاملاً وتُلغى صفحتك المنشورة عند إتمام العملية.</li>
        </ul>
      </section>

      <section>
        <h2>كيفية طلب الاسترجاع</h2>
        <ul>
          <li>
            عبر واتساب على الرقم{" "}
            <a
              href={`https://wa.me/${SUPPORT_WHATSAPP}`}
              dir="ltr"
              className="font-bold text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              +{SUPPORT_WHATSAPP}
            </a>
          </li>
          <li>
            أو عبر البريد الإلكتروني:{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} dir="ltr" className="font-bold text-primary">
              {SUPPORT_EMAIL}
            </a>
          </li>
        </ul>
        <p>
          أرفق في طلبك: البريد الإلكتروني لحسابك، ومفتاح التفعيل المستخدم، وتاريخ التفعيل.
          تتم معالجة الطلبات خلال أيام عمل قليلة، ويُعاد المبلغ بالطريقة المتفق عليها معك.
        </p>
      </section>

      <section>
        <h2>حالات لا يشملها الاسترجاع</h2>
        <ul>
          <li>الطلبات المقدمة بعد مرور 7 أيام من تاريخ التفعيل.</li>
          <li>
            المفاتيح غير المفعَّلة المشتراة من نقاط البيع أو الموزعين: تُعالَج لدى نقطة البيع
            التي تم الشراء منها.
          </li>
          <li>الحسابات الموقوفة بسبب مخالفة شروط الاستخدام.</li>
        </ul>
      </section>

      <section>
        <h2>أسئلة؟</h2>
        <p>
          فريقنا جاهز لمساعدتك قبل الشراء وبعده — تواصل معنا في أي وقت عبر واتساب أو البريد
          الإلكتروني.
        </p>
      </section>
    </LegalPage>
  );
}
