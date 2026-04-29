import { redirect } from 'next/navigation';

export default function DevsPage() {
  redirect('/?cat=devs');
}
