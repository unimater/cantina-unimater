import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import axios from 'axios';

interface ForgotPasswordInput {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

const forgotPassword = async (data: ForgotPasswordInput): Promise<ForgotPasswordResponse> => {
  const response = await axios.post('http://localhost:3000/sessions/forgot-password', data);
  return response.data;
};

export const useForgotPassword = (): UseMutationResult<
  ForgotPasswordResponse,
  unknown,                 
  ForgotPasswordInput      
> => {
  return useMutation<ForgotPasswordResponse, unknown, ForgotPasswordInput>({
    mutationFn: forgotPassword,
  });
};