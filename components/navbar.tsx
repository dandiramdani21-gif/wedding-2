import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NavbarShell } from '@/components/navbar-shell';

export async function Navbar() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  return <NavbarShell user={user} />;
}
