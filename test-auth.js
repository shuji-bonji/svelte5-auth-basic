import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('🔍 データベースの内容を確認中...');
    
    // 既存のユーザーを確認
    const users = await prisma.user.findMany();
    console.log('登録済みユーザー数:', users.length);
    
    if (users.length > 0) {
      console.log('\n📋 ユーザー一覧:');
      users.forEach(user => {
        console.log(`- ${user.email} (ID: ${user.id})`);
      });
      
      // パスワードのテスト
      const testEmail = users[0].email;
      const testPassword = 'password123'; // テスト用パスワード
      
      console.log(`\n🔐 ${testEmail} でログインテスト...`);
      const user = await prisma.user.findUnique({
        where: { email: testEmail }
      });
      
      if (user) {
        const isValid = await bcrypt.compare(testPassword, user.password);
        console.log('パスワード検証結果:', isValid ? '✅ 成功' : '❌ 失敗');
        
        if (!isValid) {
          console.log('\n💡 ヒント: パスワードが一致しない場合は、登録時に使用したパスワードを確認してください。');
        }
      }
    } else {
      console.log('\n⚠️ ユーザーが登録されていません。');
      console.log('新しいテストユーザーを作成します...');
      
      const hashedPassword = await bcrypt.hash('test123456', 10);
      const newUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          name: 'Test User'
        }
      });
      
      console.log('✅ テストユーザーを作成しました:');
      console.log('   メール: test@example.com');
      console.log('   パスワード: test123456');
    }
    
    // セッション情報も確認
    const sessions = await prisma.session.findMany();
    console.log('\n📊 アクティブセッション数:', sessions.length);
    
  } catch (error) {
    console.error('❌ エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();