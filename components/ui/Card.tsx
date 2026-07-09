import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface/70 p-5 shadow-lg shadow-black/20 backdrop-blur-sm sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
