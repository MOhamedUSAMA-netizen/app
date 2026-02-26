'use server';

import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { login, logout } from './auth';
import { redirect } from 'next/navigation';

export async function loginAction(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }

  await login({ id: user.id, email: user.email, role: user.role });
  return { success: true };
}

export async function registerAction(name: string, email: string, password: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'البريد الإلكتروني مستخدم بالفعل' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  await login({ id: user.id, email: user.email, role: user.role });
  return { success: true };
}

export async function logoutAction() {
  await logout();
  redirect('/login');
}

export async function saveQuizAction(sessionId: string, questions: any[]) {
  const quiz = await prisma.quiz.upsert({
    where: { sessionId },
    update: {
      title: 'اختبار المحاضرة',
    },
    create: {
      sessionId,
      title: 'اختبار المحاضرة',
    },
  });

  // Delete old questions
  await prisma.question.deleteMany({
    where: { quizId: quiz.id },
  });

  // Create new questions
  await prisma.question.createMany({
    data: questions.map((q) => ({
      quizId: quiz.id,
      text: q.text,
      options: JSON.stringify(q.options),
      correctAnswer: q.correctAnswer,
    })),
  });
}

export async function submitQuizAction(quizId: string, studentId: string, score: number, total: number) {
  await prisma.submission.create({
    data: {
      quizId,
      studentId,
      score,
      total,
    },
  });
}

import fs from 'fs';
import path from 'path';

export async function updateSessionContentAction(id: string, formData: FormData) {
  const videoFile = formData.get('videoFile') as File;
  const pdfFile = formData.get('pdfFile') as File;
  const videoName = formData.get('videoName') as string;
  const pdfName = formData.get('pdfName') as string;

  let videoUrl = formData.get('videoUrl') as string;
  let pdfUrl = formData.get('pdfUrl') as string;

  if (videoFile && videoFile.size > 0) {
    const buffer = Buffer.from(await videoFile.arrayBuffer());
    const fileName = `${id}_${Date.now()}_${videoFile.name}`;
    const filePath = path.join(process.cwd(), 'public/uploads', fileName);
    fs.writeFileSync(filePath, buffer);
    videoUrl = `/uploads/${fileName}`;
  }

  if (pdfFile && pdfFile.size > 0) {
    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    const fileName = `${id}_${Date.now()}_${pdfFile.name}`;
    const filePath = path.join(process.cwd(), 'public/uploads', fileName);
    fs.writeFileSync(filePath, buffer);
    pdfUrl = `/uploads/${fileName}`;
  }

  await prisma.session.update({
    where: { id },
    data: {
      videoUrl,
      videoName: videoName || videoFile?.name,
      pdfUrl,
      pdfName: pdfName || pdfFile?.name,
    },
  });

  revalidatePath(`/admin/sessions/${id}`);
  revalidatePath('/');
}

export async function trackEngagementAction(sessionId: string, studentId: string, seconds: number) {
  await prisma.videoEngagement.upsert({
    where: {
      studentId_sessionId: { studentId, sessionId },
    },
    update: {
      watched: { increment: seconds },
    },
    create: {
      studentId,
      sessionId,
      watched: seconds,
    },
  });
}
