import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export async function requireAdminApi() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}
