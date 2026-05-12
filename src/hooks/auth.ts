import { useMutation } from "@tanstack/react-query";
import {
  registerCompany,
  registerSeeker,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "@/services/authService";

export const useRegisterCompany = () =>
  useMutation({ mutationFn: registerCompany });

export const useRegisterSeeker = () =>
  useMutation({ mutationFn: registerSeeker });

export const useForgotPassword = () =>
  useMutation({ mutationFn: forgotPassword });

export const useResetPassword = () =>
  useMutation({ mutationFn: resetPassword });

export const useVerifyEmail = () =>
  useMutation({ mutationFn: verifyEmail });
