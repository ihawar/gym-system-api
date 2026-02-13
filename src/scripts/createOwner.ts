/**
 * These script is used for creating the admin user
 * Run with `npx tsx src/scripts/createAdmin.ts 0912XXXXXXX PASSWORD`
 */
import readline from 'node:readline';
import parsePhone from '@/utils/parsePhone';
import { hashPassword } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

if (process.argv.length != 4) {
  console.error(
    'Invalid argument list.\nRun with `npx tsx src/scripts/createOwner.ts 0912XXXXXXX PASSWORD`'
  );
  process.exit(1);
}

async function createAdmin(phone: string, password: string): Promise<object> {
  const user = await prisma.user.create({
    data: {
      phone: phone,
      password: password,
      role: 'OWNER',
      verified: true,
      completed: true,
    },
  });

  return user;
}

let phone = parsePhone(process.argv[2]);
let password = process.argv[3];
try {
  phone = parsePhone(phone);
  password = hashPassword(password);
} catch (e) {
  console.error(`Invalid phone number.`);
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
console.log(`Phone: ${phone}`);
rl.question('Correct(Y | N)? ', async (answer) => {
  try {
    await prisma.$connect();
    if (answer.toUpperCase() === 'Y') {
      const user = await createAdmin(phone, password);

      console.log(`User created.\n${user}`);
    } else {
      console.log('Canceled.');
    }
  } catch (error) {
    console.error(`Could not create user. Error: ${error}`);
  } finally {
    rl.close();
    await prisma.$disconnect();
    process.exit(0);
  }
});
