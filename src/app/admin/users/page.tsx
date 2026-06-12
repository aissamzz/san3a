"use client";

import { useCallback, useEffect, useState } from "react";
import { Ban, CheckCircle2, ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";

import { getAllUsers, isPageLive, toggleSuspend, type AdminUserRow } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminUsersPage() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [query, setQuery] = useState("");

  const refresh = useCallback(() => {
    getAllUsers().then(setRows);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = rows.filter((row) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      row.profile.name.toLowerCase().includes(q) ||
      row.profile.email.toLowerCase().includes(q) ||
      row.page?.slug.toLowerCase().includes(q) ||
      row.page?.city.includes(q) ||
      row.page?.businessName.includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">المستخدمون</h1>
        <p className="text-muted-foreground">جميع الحرفيين المسجلين في المنصة</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="ps-9"
          placeholder="ابحث بالاسم، البريد، الرابط أو الولاية..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>الصفحة</TableHead>
              <TableHead>الولاية</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>صالح حتى</TableHead>
              <TableHead className="text-end">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  لا توجد نتائج
                </TableCell>
              </TableRow>
            )}
            {filtered.map(({ profile, page }) => (
              <TableRow key={profile.id}>
                <TableCell>
                  <div className="font-semibold">{profile.name}</div>
                  <div className="text-xs text-muted-foreground" dir="ltr">
                    {profile.email}
                  </div>
                </TableCell>
                <TableCell>
                  {page ? (
                    <a
                      href={`/${page.slug}?preview=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      dir="ltr"
                    >
                      /{page.slug}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{page?.city ?? "—"}</TableCell>
                <TableCell>
                  {!page ? (
                    <Badge variant="muted">بدون صفحة</Badge>
                  ) : page.suspended ? (
                    <Badge variant="destructive">موقوفة</Badge>
                  ) : isPageLive(page) ? (
                    <Badge variant="success">مفعّلة</Badge>
                  ) : (
                    <Badge variant="warning">غير مفعّلة</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground" dir="ltr">
                  {page?.activatedUntil ?? "—"}
                </TableCell>
                <TableCell>
                  {page && (
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={page.suspended ? "text-green-600" : "text-destructive"}
                        onClick={async () => {
                          await toggleSuspend(page.id);
                          refresh();
                          toast.success(page.suspended ? "تم إلغاء الإيقاف" : "تم إيقاف الصفحة");
                        }}
                      >
                        {page.suspended ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            إلغاء الإيقاف
                          </>
                        ) : (
                          <>
                            <Ban className="h-4 w-4" />
                            إيقاف
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
