'use client';

import type { User } from '@/types/user';
import axios from 'axios';
import { API_URLS } from '@/api';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'ahsan',
  lastName: 'ali',
  email: 'ahsanali@yahoo.com',
} satisfies User;

export interface SignUpParams {
  name: string;
  // lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    const { name, email, password } = params;
    console.log(name, email, password);

    // Make API request
    const response = await axios.post(API_URLS.signUp, { name, email, password });

    console.log(response.data);

    if (response.status !== 201) {
      return { error: 'Invalid credentials' };
    }


    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;
    console.log(email, password);

    // Make API request
    const response = await axios.post(API_URLS.signIn, { email, password });

    if (response.status !== 200) {
      return { error: 'Invalid credentials' };
    } 

    if (response.data.role !== 'teacher') {
      return { error: 'You are not a teacher' };
    }

    localStorage.setItem('custom-auth-token', response.data.token);
    localStorage.setItem('user-email', email);
    localStorage.setItem('user-name', response.data.name);

    console.log(response.data);

    // We do not handle the API, so we'll check if the credentials match with the hardcoded ones.
    // if (email !== 'sofia@devias.io' || password !== 'Secret1') {
    //   return { error: 'Invalid credentials' };
    // }

    // const token = generateToken();
    // localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
