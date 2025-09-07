import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import {sign} from 'hono/jwt'
import { signinSchema,signupSchema } from "@bala_dev/inknest-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();


userRouter.post("/signup", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
   
    const parsed = signupSchema.safeParse(body);
    if(!parsed){
      return c.json({message:"Please Provide Valid credentials"})
    }
    


    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password, 
      },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt: token });
  } catch (error: any) {

    c.status(500);
    return c.json({ error: "Something went wrong during signup" });
  }
});


userRouter.post("/signin", async (c) => {
  try {
    const prisma = new PrismaClient({
      // @ts-ignore
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    ;

    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password,
      },
    });



    if (!user) {
      c.status(403);
      return c.json({ error: "Invalid email or password" });
    }


    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (error: any) {
   
    c.status(500);
    return c.json({ error: error.message || "Something went wrong during signin" });

  }
  
}
);



