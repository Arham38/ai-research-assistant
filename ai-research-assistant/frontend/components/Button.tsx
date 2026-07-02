interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<string, string> = {
  primary: "bg-ink text-white hover:opacity-90",
  secondary: "bg-margin/50 text-ink hover:bg-margin",
  ghost: "text-ink-light hover:text-ink hover:bg-margin/30",
  outline: "border border-margin text-ink hover:border-ink-light hover:bg-margin/10",
};

export default function Button({
  children,
  variant = "primary",
  href,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-card px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
  const styles = `${base} ${VARIANT_STYLES[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={styles}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={styles}>
      {children}
    </button>
  );
}