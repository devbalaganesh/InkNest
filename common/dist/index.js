import { z } from 'zod';
export const signupSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
});
export const signinSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6),
});
export const createBlogSchema = z.object({
    title: z.string(),
    content: z.string(),
    id: z.number()
});
export const updateBlogSchema = z.object({
    title: z.string(),
    content: z.string(),
    id: z.number()
});
//# sourceMappingURL=index.js.map