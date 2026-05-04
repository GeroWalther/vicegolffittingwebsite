import { ComponentProps } from "react";
import { type VariantProps } from "class-variance-authority";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LinkButtonProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants>;

export function LinkButton({
  className,
  variant,
  size,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
