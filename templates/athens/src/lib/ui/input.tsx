import { cn } from "@/lib/utils/tailwind";

type InputProps = {
  className?: string;
} & React.ComponentProps<"input">;

export default function Input({ className, ...restProps }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-stone-200 px-3 py-2 transition-colors placeholder:text-stone-500 focus:border-stone-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-sm",
        className
      )}
      {...restProps}
    />
  );
}
