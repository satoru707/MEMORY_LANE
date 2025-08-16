"use client";
import React from "react";
import { cn } from "../../_lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  padding = "md",
  onClick,
}) => {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-neutral-200 shadow-soft",
        hover && "hover:shadow-soft-lg transition-shadow duration-200",
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
