/**
 * Notification provider using notistack
 * Handles display of notifications from the notification store
 */

import { useNotificationStore } from "@/stores";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  SnackbarContent,
  SnackbarProvider,
  useSnackbar,
  type CustomContentProps,
} from "notistack";
import { forwardRef, useCallback, useEffect, type ReactNode } from "react";

const snackbarStyles = {
  containerRoot: {
    zIndex: 9999,
  },
  // Base styles for all variants
  root: {
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
    borderRadius: "8px",
    boxShadow: "var(--shadow-card)",
  },
};

const CustomSnackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  (props, ref) => {
    const { id, message, variant } = props;
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    const variantStyles = {
      default: {
        backgroundColor: "var(--sprd-current-line)",
        color: "var(--sprd-foreground)",
        borderColor: "var(--sprd-comment)",
      },
      success: {
        backgroundColor: "var(--sprd-green)",
        color: "var(--sprd-foreground)",
        borderColor: "var(--sprd-green)",
      },
      error: {
        backgroundColor: "var(--sprd-red)",
        color: "var(--sprd-foreground)",
        borderColor: "var(--sprd-red)",
      },
      warning: {
        backgroundColor: "var(--sprd-orange)",
        color: "var(--sprd-foreground)",
        borderColor: "var(--sprd-orange)",
      },
      info: {
        backgroundColor: "var(--sprd-cyan)",
        color: "var(--sprd-foreground)",
        borderColor: "var(--sprd-cyan)",
      },
    };

    const currentStyle = variantStyles[variant] || variantStyles.default;

    return (
      <SnackbarContent ref={ref} role="alert">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            padding: "12px 16px",
            minWidth: "280px",
            maxWidth: "400px",
            borderRadius: "8px",
            border: `1px solid ${currentStyle.borderColor}`,
            backgroundColor: currentStyle.backgroundColor,
            color: currentStyle.color,
            boxShadow: "var(--shadow-card)",
          }}
        >
          <span
            style={{
              flex: 1,
              fontSize: "15px",
              lineHeight: "1.5",
              fontWeight: 700,
            }}
          >
            {message}
          </span>
          <button
            onClick={handleDismiss}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: currentStyle.color,
              opacity: 0.7,
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            aria-label="Close notification"
          >
            <XMarkIcon
              style={{
                width: "18px",
                height: "18px",
                color: "var(--sprd-secondary)",
              }}
            />
          </button>
        </div>
      </SnackbarContent>
    );
  },
);

const NotificationHandler = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { notifications, removeNotification } = useNotificationStore();

  useEffect(() => {
    if (notifications.length > 0) {
      const notification = notifications[0];
      enqueueSnackbar(notification.message, {
        variant: notification.variant,
        autoHideDuration: 3000,
        ...notification.options,
      });
      removeNotification();
    }
  }, [notifications, enqueueSnackbar, removeNotification]);

  return null;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={5000}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      preventDuplicate
      Components={{
        default: CustomSnackbar,
        success: CustomSnackbar,
        error: CustomSnackbar,
        warning: CustomSnackbar,
        info: CustomSnackbar,
      }}
      style={snackbarStyles.root}
    >
      <NotificationHandler />
      {children}
    </SnackbarProvider>
  );
};
