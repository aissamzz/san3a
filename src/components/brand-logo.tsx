import { cn } from "@/lib/utils";

/**
 * The صنعة brand mark: a rounded badge in the brand color with a stylised
 * mallet/hammer glyph. Uses theme CSS variables so it stays on-brand in any
 * surface. For the favicon/app icons see src/app/icon.svg and apple-icon.svg.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-8 w-8", className)}
      role="img"
      aria-label="صنعة"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="12" fill="var(--primary)" />
      <g transform="rotate(-18 24 24)" fill="var(--primary-foreground)">
        <rect x="13" y="11" width="22" height="8.5" rx="3" />
        <rect x="21.5" y="13" width="5" height="23" rx="2.5" />
      </g>
    </svg>
  );
}
