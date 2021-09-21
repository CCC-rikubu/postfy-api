import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/feed", async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  res.json(posts);
});

app.get(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findMany({
    where: { id: Number(id) },
  });
  res.json(post);
});

app.get(`/posts`, async (req, res) => {
  const post = await prisma.post.findMany({
    where: { published: true },
  });
  res.json(post);
});

app.post(`/user`, async (req, res) => {
  const result = await prisma.user.create({
    data: { ...req.body },
  });
  res.json(result);
});

app.post(`/post`, async (req, res) => {
  const { title, content, authorEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      published: true,
      author: { connect: { email: authorEmail } },
    },
  });
  res.json(result);
});

app.listen(3000, () =>
  console.log("REST API server ready at: http://localhost:3000")
);
