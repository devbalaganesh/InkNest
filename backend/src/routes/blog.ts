import { Hono } from 'hono';
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from 'hono/jwt';

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>();


blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  const token = authHeader.split(" ")[1];
  try {
    const user = await verify(token, c.env.JWT_SECRET);
    if (!user) throw new Error("Invalid token");
    c.set("userId", String(user.id));
    await next();
  } catch {
    c.status(403);
    return c.json({ message: "you are not logged in" });
  }
});

const getPrisma = (c: any) =>
  new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

// Create post
blogRouter.post('/api/v1/blog', async (c) => {
  const prisma = getPrisma(c);
  const userId = c.get('userId');
  const body = await c.req.json();

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: userId,
    },
  });

  return c.json({ id: post.id });
});

// Update post
blogRouter.put('/api/v1/blog', async (c) => {
  const prisma = getPrisma(c);
  const userId = c.get('userId');
  const body = await c.req.json();

  // Ensure id is string
  const id = String(body.id);

  await prisma.post.update({
    where: { id, authorId: userId },
    data: { title: body.title, content: body.content },
  });

  return c.text('updated post');
});

// Get single post
blogRouter.get('/api/v1/blog/:id', async (c) => {
  const prisma = getPrisma(c);
  // id from URL param as string
  const id = c.req.param('id');

  const post = await prisma.post.findUnique({ where: { id } });

  return c.json(post);
});

blogRouter.get('/api/v1/blog/bulk', async (c) => {
  const prisma = getPrisma(c);

  const limit = Number(c.req.query("limit") || "10");
  const cursor = c.req.query("cursor") || null;

  const posts = await prisma.post.findMany({
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
 
  });

  return c.json({ posts });
});

