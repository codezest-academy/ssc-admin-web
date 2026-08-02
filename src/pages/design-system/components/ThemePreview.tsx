import React from "react";

export const ThemePreview = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) => (
  <div className="space-y-4 my-8">
    {(title || description) && (
      <div>
        {title && <h3 className="text-xl font-semibold tracking-tight">{title}</h3>}
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    )}
    <div className="overflow-hidden rounded-xl border bg-background text-foreground p-8 flex flex-col justify-center items-center min-h-[300px] relative">
      <div className="w-full max-w-md relative">{children}</div>
    </div>
  </div>
);
