/**
 * Authentication mutation hooks
 * Handles login, logout, and other auth-related mutations
 */

import { authService } from "@/services";
import { useLoadingStore, useNotificationStore, useUserStore } from "@/stores";
import type { LoginRequest } from "@/types/auth";
import { handleMutationError } from "@/utils/errorHandler";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

/**
 * Login mutation hook
 */
export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setAuth } = useUserStore();
  const { startLoading, stopLoading } = useLoadingStore();
  const { showSuccess, showError } = useNotificationStore();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onMutate: () => {
      startLoading();
    },
    onSuccess: (response) => {
      stopLoading();

      // Extract user and tokens from response
      const { accessToken, refreshToken, ...userData } = response.data;

      // Store user data and tokens
      setAuth(userData, accessToken, refreshToken);

      // Show success notification
      showSuccess(response.message);

      // Navigate to dashboard
      navigate("/dashboard");
    },
    onError: (error: unknown) => {
      stopLoading();
      handleMutationError(error, showError, "Login failed. Please try again.");
    },
  });
};
