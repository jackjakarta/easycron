import { redirect, RedirectType } from 'next/navigation';

export default function Page() {
  redirect('/developers/api-keys', RedirectType.replace);
}
