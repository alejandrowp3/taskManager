import { z } from 'zod';

// Form input schema (without transforms for React Hook Form compatibility)
export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  
  status: z.enum(['To Do', 'In Progress', 'Done'] as const),
  
  priority: z.enum(['Low', 'Medium', 'High'] as const),
  
  dueDate: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()) && parsedDate >= new Date(Date.now() - 24 * 60 * 60 * 1000);
    }, 'Due date must be today or in the future'),
  
  assignee: z
    .string()
    .max(50, 'Assignee name must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  
  tags: z
    .string()
    .optional()
    .refine((tags) => {
      if (!tags || tags.trim() === '') return true;
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      return tagArray.length <= 10 && tagArray.every(tag => tag.length <= 20);
    }, 'Maximum 10 tags, each up to 20 characters')
});

// Base task validation schema
export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  
  status: z.enum(['To Do', 'In Progress', 'Done'] as const),
  
  priority: z.enum(['Low', 'Medium', 'High'] as const),
  
  dueDate: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true; // Optional field
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()) && parsedDate >= new Date(Date.now() - 24 * 60 * 60 * 1000); // Allow today or future
    }, 'Due date must be today or in the future'),
  
  assignee: z
    .string()
    .max(50, 'Assignee name must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  
  tags: z
    .string()
    .optional()
    .transform((tags) => {
      if (!tags || tags.trim() === '') return [];
      return tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .slice(0, 10); // Limit to 10 tags
    })
    .refine((tags: string[]) => {
      return tags.every(tag => tag.length <= 20);
    }, 'Each tag must be less than 20 characters')
    .refine((tags: string[]) => {
      const uniqueTags = new Set(tags.map(tag => tag.toLowerCase()));
      return uniqueTags.size === tags.length;
    }, 'Tags must be unique')
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskFormSchema>;

// Schema for creating new tasks (strict date validation)
export const createTaskSchema = taskSchema;

// Schema for updating existing tasks (relaxed date validation)
export const updateTaskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .trim()
    .optional(),
  
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  
  status: z.enum(['To Do', 'In Progress', 'Done'] as const).optional(),
  
  priority: z.enum(['Low', 'Medium', 'High'] as const).optional(),
  
  // Relaxed date validation for updates - allow past dates for existing tasks
  dueDate: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, 'Due date must be a valid date'),
  
  assignee: z
    .string()
    .max(50, 'Assignee name must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  
  tags: z
    .string()
    .optional()
    .refine((tags) => {
      if (!tags) return true;
      const tagArray = tags.split(',').map(tag => tag.trim());
      return tagArray.length <= 10;
    }, 'Maximum 10 tags allowed')
    .refine((tags) => {
      if (!tags) return true;
      const tagArray = tags.split(',').map(tag => tag.trim());
      return tagArray.every(tag => tag.length <= 20);
    }, 'Each tag must be less than 20 characters')
});

export const updateTaskSchema = updateTaskFormSchema.refine(
  (data) => Object.keys(data).length > 0,
  'At least one field must be provided for update'
);

export const validateTaskTitle = (title: string): boolean => {
  try {
    taskFormSchema.pick({ title: true }).parse({ title });
    return true;
  } catch {
    return false;
  }
};

export const getTaskValidationErrors = (data: any): Record<string, string> => {
  try {
    taskFormSchema.parse(data);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.reduce((acc: Record<string, string>, err) => {
        const path = err.path.join('.');
        acc[path] = err.message;
        return acc;
      }, {} as Record<string, string>);
    }
    return { general: 'Validation error occurred' };
  }
};
