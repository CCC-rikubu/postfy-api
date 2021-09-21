import { PrismaClient } from "@prisma/client";
import fastify, {
  FastifyReply,
  FastifyRequest,
  RequestGenericInterface,
} from "fastify";

const prisma = new PrismaClient();
const app = fastify({ logger: true });

app.get("/users", async (_req: FastifyRequest, res: FastifyReply) => {
  const users = await prisma.user.findMany();
  await res.send(users);
});

app.get("/feed", async (_req: FastifyRequest, res: FastifyReply) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  await res.send(posts);
});

interface PostGetRequest extends RequestGenericInterface {
  Params: {
    id: number;
  };
}
app.get<PostGetRequest>(`/post/:id`, async (req, res: FastifyReply) => {
  const { id } = req.params;
  const post = await prisma.post.findMany({
    where: { id: Number(id) },
  });
  await res.send(post);
});

app.get(`/posts`, async (_req: FastifyRequest, res: FastifyReply) => {
  const post = await prisma.post.findMany({
    where: { published: true },
  });
  await res.send(post);
});

interface UserData {
  name: string;
  email: string;
}

interface UserPostBody extends RequestGenericInterface {
  Body: {
    data: UserData;
  };
}

app.post(
  `/user`,
  async (req: FastifyRequest<UserPostBody>, res: FastifyReply) => {
    const { data } = req.body;
    const result = await prisma.user.create({
      data,
    });
    await res.send(result);
  },
);

interface PostPostBody extends RequestGenericInterface {
  Body: {
    title: string;
    content: string;
    authorEmail: string;
  };
}

app.post(
  `/post`,
  async (req: FastifyRequest<PostPostBody>, res: FastifyReply) => {
    const { title, content, authorEmail } = req.body;
    const result = await prisma.post.create({
      data: {
        title,
        content,
        published: true,
        author: { connect: { email: authorEmail } },
      },
    });
    await res.send(result);
  },
);

app.listen(3000, () =>
  console.log("REST API server ready at: http://localhost:3000"),
);
