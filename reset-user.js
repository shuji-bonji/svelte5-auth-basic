import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetUser() {
  try {
    const email = 'test@example.com';
    const password = 'test123456';
    
    console.log('🔄 ユーザーをリセット中...');
    
    // 既存のtest@example.comユーザーを削除
    await prisma.user.deleteMany({
      where: { email }
    });
    
    // 新しいユーザーを作成
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('ハッシュ化されたパスワード:', hashedPassword);
    
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Test User'
      }
    });
    
    console.log('✅ テストユーザーを作成しました:');
    console.log('   ID:', newUser.id);
    console.log('   メール:', email);
    console.log('   パスワード:', password);
    
    // パスワード検証テスト
    console.log('\n🔐 パスワード検証テスト...');
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('検証結果:', isValid ? '✅ 成功' : '❌ 失敗');
    
  } catch (error) {
    console.error('❌ エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetUser();