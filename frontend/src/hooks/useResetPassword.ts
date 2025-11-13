import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import axios from 'axios';

interface ResetPasswordInput {
  email: string;
  codigo: string;
  novaSenha: string;
}

interface ResetPasswordResponse {
  message: string;
}

export const resetPassword = async (
  data: ResetPasswordInput
): Promise<ResetPasswordResponse> => {
  const response = await axios.post('http://localhost:3000/sessions/reset-password', data);
  return response.data;
};

export const useResetPassword = (): UseMutationResult<
  ResetPasswordResponse,
  unknown,
  ResetPasswordInput
> => {
  return useMutation<ResetPasswordResponse, unknown, ResetPasswordInput>({
    mutationFn: resetPassword,
  });
};
