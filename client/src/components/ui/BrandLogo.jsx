const sizeClasses = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-12 w-12",
};

export function BrandLogo({ size = "md", className = "" }) {
  return (
    <img
      src="/favicon.png"
      alt="Expense Tracker logo"
      className={`${sizeClasses[size] || sizeClasses.md} shrink-0 rounded-xl object-contain ${className}`}
    />
  );
}
