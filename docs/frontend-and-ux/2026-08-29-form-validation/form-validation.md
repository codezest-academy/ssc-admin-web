# Form Validation Strategies

**Date:** 2026-08-29
**Status:** 🟢 Active

---

## Context
Standardizing how we handle complex forms (like Question creation, Mock Test building) ensures a consistent UI and simplifies error handling.

## Stack
- **Form State:** React Hook Form (`react-hook-form`).
- **Schema Validation:** Zod (`zod`).

## Guidelines

1. **Always use Zod for schemas.** Define a Zod schema for the form data. This provides both runtime validation and TypeScript type inference.
2. **Colocate schemas.** Place the Zod schema in the same file or a closely related file to the form component.
3. **Shared Error Messages.** Use consistent error messages. Create a central dictionary or utility for common validation messages (e.g., "This field is required", "Invalid email format").
4. **Server-Side Validation Alignment.** The frontend Zod schema should closely mirror the backend validation schema. 
5. **Handling API Errors.** When the API returns a 400 Bad Request with field-specific errors, map those errors back to the `react-hook-form` instance using `setError()` so they appear inline with the form fields.

## Example Pattern
```tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subjectId: z.string().uuid("Invalid subject selected"),
});

type FormData = z.infer<typeof formSchema>;

export function SubjectForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });
  // ...
}
```
