"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, KeyRound, Plus } from "lucide-react";
import { toast } from "sonner";

import { generateKeys, getAllKeys, getPageById } from "@/lib/store";
import type { ActivationKey, Page } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminKeysPage() {
  const [keys, setKeys] = useState<ActivationKey[]>([]);
  const [usedByPages, setUsedByPages] = useState<Record<string, Page>>({});
  const [count, setCount] = useState(5);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    (async () => {
      const allKeys = await getAllKeys();
      setKeys(allKeys);
      const pageIds = Array.from(
        new Set(allKeys.map((k) => k.usedByPageId).filter((id): id is string => !!id))
      );
      const pages = await Promise.all(pageIds.map((id) => getPageById(id)));
      const map: Record<string, Page> = {};
      pages.forEach((p, i) => {
        if (p) map[pageIds[i]] = p;
      });
      setUsedByPages(map);
    })();
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const generate = async () => {
    if (count < 1 || count > 100) {
      toast.error("اختر عدداً بين 1 و 100");
      return;
    }
    const created = await generateKeys(count);
    refresh();
    toast.success(`تم توليد ${created.length} مفتاح`);
  };

  const copy = async (key: ActivationKey) => {
    await navigator.clipboard.writeText(key.code);
    setCopiedId(key.id);
    toast.success("تم نسخ المفتاح");
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">مفاتيح التفعيل</h1>
        <p className="text-muted-foreground">
          ولّد مفاتيح وبِعها عبر نقاط البيع — كل مفتاح يفعّل صفحة لمدة سنة (4500 دج)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            توليد مفاتيح جديدة
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label htmlFor="key-count">عدد المفاتيح</Label>
            <Input
              id="key-count"
              type="number"
              dir="ltr"
              min={1}
              max={100}
              className="w-28"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>
          <Button onClick={generate}>
            <Plus className="h-4 w-4" />
            توليد
          </Button>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المفتاح</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>مستعمل من طرف</TableHead>
              <TableHead className="text-end">نسخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key) => {
              const usedBy = key.usedByPageId ? usedByPages[key.usedByPageId] ?? null : null;
              return (
                <TableRow key={key.id}>
                  <TableCell dir="ltr" className="font-mono text-sm">
                    {key.code}
                  </TableCell>
                  <TableCell>
                    {key.status === "used" ? (
                      <Badge variant="muted">مستعمل</Badge>
                    ) : (
                      <Badge variant="success">متاح</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {usedBy ? usedBy.businessName : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="نسخ المفتاح"
                        disabled={key.status === "used"}
                        onClick={() => copy(key)}
                      >
                        {copiedId === key.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
