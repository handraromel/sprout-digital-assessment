/**
 * UserDetailsModal Component
 * Displays user profile information in a modal using the Modal component
 */

import { Modal } from "@/components/common/Modal";
import { useUserStore } from "@/stores";
import { useModalStore } from "@/stores/modalStore";
import {
  EnvelopeIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Button } from "./Button";

const MODAL_ID = "user-details-modal";

export const UserDetailsModal = () => {
  const { user } = useUserStore();
  const { isOpen, close } = useModalStore();
  const modalIsOpen = isOpen(MODAL_ID);

  if (!user) return null;

  return (
    <Modal
      isOpen={modalIsOpen}
      onClose={() => close(MODAL_ID)}
      title="User Profile"
      size="md"
      showCloseButton={true}
      closeOnOverlayClick={true}
    >
      {/* User avatar */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
          <UserCircleIcon className="h-16 w-16 text-purple-600" />
        </div>
        <h2 className="text-foreground text-2xl font-bold">{user.fullname}</h2>
        <p className="text-foreground-muted mt-1 text-sm">@{user.username}</p>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100">
          <EnvelopeIcon className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500">Email</p>
            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
          </div>
        </div>

        {/* Username */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100">
          <UserIcon className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500">Username</p>
            <p className="mt-1 text-sm text-gray-900">{user.username}</p>
          </div>
        </div>

        {/* Account Created */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Account Created</span>
            <span className="text-gray-700">
              {new Date(user.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-gray-500">Last Updated</span>
            <span className="text-gray-700">
              {new Date(user.updatedAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="mt-6 flex gap-3">
        <Button
          onClick={() => close(MODAL_ID)}
          variant="primary"
          className="w-full justify-center"
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};
