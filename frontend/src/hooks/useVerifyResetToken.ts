import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import axios from 'axios';

interface VerifyResetTokenInput {
  email: string;
  codigo: string;
}

interface VerifyResetTokenResponse {
  message: string;
}

export const verifyResetToken = async (
  data: VerifyResetTokenInput
): Promise<VerifyResetTokenResponse> => {
  const response = await axios.post('http://localhost:3000/sessions/verify-reset-token', data);
  return response.data;
};

export const useVerifyResetToken = (): UseMutationResult<
  VerifyResetTokenResponse,
  unknown,
  VerifyResetTokenInput
> => {
  return useMutation<VerifyResetTokenResponse, unknown, VerifyResetTokenInput>({
    mutationFn: verifyResetToken,
  });
};
