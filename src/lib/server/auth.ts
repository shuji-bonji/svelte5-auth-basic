import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type { Cookies } from '@sveltejs/kit';

const prisma = new PrismaClient();

// セッションの有効期限（7日）
const SESSION_EXPIRY_DAYS = 7;

export interface User {
  id: string;
  email: string;
  name: string | null;
}

/**
 * パスワードのハッシュ化
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * パスワードの検証
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * ユーザーの作成
 */
export async function createUser(email: string, password: string, name?: string): Promise<User> {
  const hashedPassword = await hashPassword(password);
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null
    },
    select: {
      id: true,
      email: true,
      name: true
    }
  });
  
  return user;
}

/**
 * メールアドレスでユーザーを検索
 */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  });
}

/**
 * セッションの作成
 */
export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);
  
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt
    }
  });
  
  return token;
}

/**
 * セッションの検証
 */
export async function validateSession(token: string): Promise<User | null> {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });
  
  if (!session) {
    return null;
  }
  
  // セッションの有効期限チェック
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({
      where: { id: session.id }
    });
    return null;
  }
  
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name
  };
}

/**
 * セッションの削除
 */
export async function deleteSession(token: string): Promise<void> {
  await prisma.session.delete({
    where: { token }
  }).catch(() => {
    // セッションが存在しない場合はエラーを無視
  });
}

/**
 * Cookieにセッションを設定
 */
export function setSessionCookie(cookies: Cookies, token: string): void {
  cookies.set('session', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS // 30日
  });
}

/**
 * Cookieからセッションを削除
 */
export function deleteSessionCookie(cookies: Cookies): void {
  cookies.delete('session', { path: '/' });
}