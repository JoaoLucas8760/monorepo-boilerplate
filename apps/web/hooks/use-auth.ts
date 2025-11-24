'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authApi, type LoginDto, type RegisterDto } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (response) => {
      Cookies.set('auth_token', response.access_token, { expires: 7 });
      useAuthStore.setState({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
      queryClient.setQueryData(['auth', 'profile'], response.user);
      router.push('/');
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const loginMutation = useLogin();

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: async (user, variables) => {
      // Após registro, fazer login automaticamente
      await loginMutation.mutateAsync({
        email: variables.email,
        password: variables.password,
      });
    },
  });
}

export function useProfile() {
  const token = Cookies.get('auth_token');

  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => authApi.getProfile(),
    enabled: !!token,
    retry: false,
    onSuccess: (user) => {
      useAuthStore.setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    },
    onError: () => {
      Cookies.remove('auth_token');
      useAuthStore.getState().logout();
      useAuthStore.setState({ isLoading: false });
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    Cookies.remove('auth_token');
    logout();
    queryClient.clear();
    router.push('/login');
  };
}

