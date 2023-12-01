'use server';

import { cookies } from 'next/headers';

export async function updateUser(formData: FormData) {
  'use server';

  const cookieStore = cookies();
  const jwtCookie = cookieStore.get('jwt');

  if (!jwtCookie) throw new Error('No JWT found');

  const url = `http://localhost:8002/user/`;

  const email = formData.get('email');
  const username = formData.get('username');

  if (typeof email !== 'string' || typeof username !== 'string') {
    throw new Error('Invalid form data');
  }

  const data: Pick<User, 'email' | 'username'> = { email, username };

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY || '',
      Authorization: `Bearer ${jwtCookie.value}`,
    },
    body: JSON.stringify(data),
  });

  const body = await res.json();

  if (!res.ok) {
    console.error('Failed to update user:', body);
    return;
  }

  console.log('Successfully updated user:', body);
}

export async function changePassword(formData: FormData) {
  'use server';

  const data = {
    currentPassword: formData.get('current_password'),
    newPassword: formData.get('new_password'),
    confirmPassword: formData.get('confirm_password'),
  };

  console.log('Changing password:', data);
}

export async function deleteAccount() {
  'use server';

  console.log('Deleting account');
}
