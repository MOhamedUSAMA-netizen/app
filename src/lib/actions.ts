'use server';

import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { login, logout } from './auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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

export async function submitQuizAction(quizId: string, studentId: string, score: number, total: number, answers: number[]) {
  await prisma.submission.create({
    data: {
      quizId,
      studentId,
      score,
      total,
      answers: JSON.stringify(answers),
    },
  });
}

import fs from 'fs';
import path from 'path';

export async function addMediaAction(sessionId: string, formData: FormData) {
  const file = formData.get('file') as File;
  const name = formData.get('name') as string;
  const type = formData.get('type') as string; // VIDEO or PDF
  let url = formData.get('url') as string;

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${sessionId}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    url = `/uploads/${fileName}`;
  }

  if (!url) return { error: 'يرجى اختيار ملف أو إدخال رابط' };

  await prisma.media.create({
    data: {
      sessionId,
      type,
      name: name || file?.name || 'مرفق جديد',
      url,
      order: 0,
    },
  });

  revalidatePath(`/admin/sessions/${sessionId}`);
  revalidatePath('/');
}

export async function deleteMediaAction(mediaId: string, sessionId: string) {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (media && media.url.startsWith('/uploads/')) {
    const filePath = path.join(process.cwd(), 'public', media.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  await prisma.media.delete({ where: { id: mediaId } });
  revalidatePath(`/admin/sessions/${sessionId}`);
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

export async function generateAccessCodesAction(sessionId: string, count: number, durationHrs: number) {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) return { error: 'Session not found' };

  const codes = [];
  for (let i = 0; i < count; i++) {
    const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    const randomPart2 = Math.random().toString(36).substring(2, 4).toUpperCase();
    const code = `HIST-${randomPart}-${randomPart2}-${Math.floor(Math.random() * 100)}`;
    codes.push({
      code,
      sessionId,
      durationHrs,
    });
  }

  await prisma.accessCode.createMany({
    data: codes,
  });

  revalidatePath(`/admin/sessions/${sessionId}`);
}

export async function deleteAccessCodeAction(codeId: string, sessionId: string) {
  await prisma.accessCode.delete({ where: { id: codeId } });
  revalidatePath(`/admin/sessions/${sessionId}`);
}

export async function redeemCodeAction(studentId: string, code: string) {
  const accessCode = await prisma.accessCode.findUnique({
    where: { code },
    include: { session: true }
  });

  if (!accessCode) {
    return { error: 'كود غير صحيح' };
  }

  if (accessCode.isUsed) {
    return { error: 'تم استخدام هذا الكود من قبل' };
  }

  const expiresAt = new Date(Date.now() + accessCode.durationHrs * 60 * 60 * 1000);

  // Update code status
  await prisma.accessCode.update({
    where: { id: accessCode.id },
    data: {
      isUsed: true,
      usedById: studentId,
      usedAt: new Date(),
    }
  });

  // Grant access
  await prisma.studentAccess.upsert({
    where: {
      studentId_sessionId: {
        studentId,
        sessionId: accessCode.sessionId
      }
    },
    update: {
      isLocked: false,
      expiresAt: expiresAt,
    },
    create: {
      studentId,
      sessionId: accessCode.sessionId,
      isLocked: false,
      expiresAt: expiresAt,
    }
  });

  revalidatePath('/');
  return { success: true };
}
