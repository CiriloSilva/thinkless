import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import { PrismaClient, TransactionType, CategoryName, GoalType } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

// plugins
await fastify.register(cors, { origin: true });
await fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'supersecret' });

// auth decorator
fastify.decorate("authenticate", async (req, reply) => {
  try { await req.jwtVerify(); }
  catch { reply.code(401).send({ message:'Unauthorized'}); }
});

// ---------- AUTH ----------
fastify.post('/api/register', async (req, reply)=>{
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password,10);
  const user = await prisma.user.create({ data:{ name, email, password:hashed }});
  const token = fastify.jwt.sign({ id:user.id, email:user.email, name:user.name });
  reply.send({ token });
});

fastify.post('/api/login', async (req, reply)=>{
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where:{ email }});
  if(!user) return reply.code(401).send({ message:'Invalid credentials'});
  const ok = await bcrypt.compare(password,user.password);
  if(!ok) return reply.code(401).send({ message:'Invalid credentials'});
  const token = fastify.jwt.sign({ id:user.id, email:user.email, name:user.name });
  reply.send({ token });
});

// ---------- TRANSACTIONS ----------
fastify.get('/api/transactions',{ preHandler:[fastify.authenticate]}, async (req)=>{
  return prisma.transaction.findMany({
    where:{ userId:req.user.id },
    orderBy:{ createdAt:'desc'}
  });
});

fastify.post('/api/transactions',{ preHandler:[fastify.authenticate]}, async (req,reply)=>{
  const { title, amount, type, category, isRecurring=false, endDate } = req.body;
  if(!title||!amount||!type||!category) return reply.code(400).send({ message:'Missing fields'});
  const createOne = async (dateCreated)=> prisma.transaction.create({
      data:{ title, amount:parseFloat(amount), type, category, isRecurring, endDate:endDate?new Date(endDate):null,
        createdAt:dateCreated, userId:req.user.id }
  });

  const first = await createOne(new Date());
  const arr=[first];
  if(isRecurring && endDate){
    let next = dayjs().add(1,'month').startOf('day');
    const lim = dayjs(endDate);
    while(next.isBefore(lim)||next.isSame(lim,'day')){
      arr.push(await createOne(next.toDate()));
      next = next.add(1,'month');
    }
  }
  reply.code(201).send(arr);
});

fastify.delete('/api/transactions/:id',{ preHandler:[fastify.authenticate]}, async (req, reply)=>{
  try{
    await prisma.transaction.delete({ where:{ id:parseInt(req.params.id), userId:req.user.id }});
    reply.code(204).send();
  }catch{ reply.code(404).send({ message:'Not found'});}
});

// ---------- SUMMARY ----------
fastify.get('/api/summary',{ preHandler:[fastify.authenticate]}, async (req)=>{
  const now = dayjs();
  const start=now.startOf('month').toDate();
  const end  =now.endOf('month').toDate();
  const tx = await prisma.transaction.findMany({
    where:{ userId:req.user.id, createdAt:{ gte:start,lte:end } }
  });
  const grouped={ INCOME:{}, EXPENSE:{} };
  tx.forEach(t=>{
    const bucket = grouped[t.type]||{};
    bucket[t.category]=(bucket[t.category]||0)+t.amount;
    grouped[t.type]=bucket;
  });
  return grouped;
});

// ---------- GOALS ----------
fastify.post('/api/goals',{ preHandler:[fastify.authenticate]}, async (req)=>{
  const { type, amount, monthYear } = req.body;
  return prisma.goal.upsert({
    where:{ userId_type_monthYear:{ userId:req.user.id, type, monthYear:new Date(monthYear)}},
    update:{ amount:parseFloat(amount)},
    create:{ userId:req.user.id, type, amount:parseFloat(amount), monthYear:new Date(monthYear)}
  });
});

fastify.get('/api/goals',{ preHandler:[fastify.authenticate]}, async (req)=>{
  const { month } = req.query; // '2025-05'
  const start = new Date(month+'-01T00:00:00');
  return prisma.goal.findMany({ where:{ userId:req.user.id, monthYear:start }});
});

// ---------- SERVER ----------
fastify.listen({ port:process.env.PORT||3000, host:'0.0.0.0'}, (err,addr)=>{
  if(err){ fastify.log.error(err); process.exit(1);}
  fastify.log.info(`Server listening at ${addr}`);
});
