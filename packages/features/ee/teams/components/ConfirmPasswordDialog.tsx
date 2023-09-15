import React, { useRef, useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Alert, Button, Dialog, DialogClose, DialogContent, DialogFooter, PasswordField } from "@calcom/ui";
import { AlertTriangle } from "@calcom/ui/components/icon";

interface ConfirmPasswordDialogProps {
  confirmPasswordOpen: boolean;
  setConfirmPasswordOpen: (value: boolean) => void;
  onConfirmPasswordSuccess: () => void;
}

export default function ConfirmPasswordDialog({
  confirmPasswordOpen,
  setConfirmPasswordOpen,
  onConfirmPasswordSuccess,
}: ConfirmPasswordDialogProps) {
  const { t } = useLocale();
  const [confirmPasswordErrorMessage, setConfirmPasswordDeleteErrorMessage] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const passwordRef = useRef<HTMLInputElement>(null!);

  const confirmPasswordMutation = trpc.viewer.auth.verifyPassword.useMutation({
    onSuccess() {
      onConfirmPasswordSuccess();
      setConfirmPasswordOpen(false);
    },
    onError() {
      setConfirmPasswordDeleteErrorMessage(t("incorrect_password"));
    },
  });

  const onConfirmPassword = (e: Event | React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    const password = passwordRef.current.value;
    confirmPasswordMutation.mutate({ passwordInput: password });
  };

  return (
    <Dialog
      open={confirmPasswordOpen}
      onOpenChange={(open) => {
        setConfirmPasswordOpen(open);
        if (!open) {
          setConfirmPasswordDeleteErrorMessage("");
        }
      }}>
      <DialogContent
        title={t("confirm_password")}
        description={t("team_invite_confirm_password")}
        type="creation"
        Icon={AlertTriangle}>
        <div className="mb-10">
          <PasswordField
            data-testid="password"
            name="password"
            id="password"
            autoComplete="current-password"
            required
            label="Password"
            ref={passwordRef}
          />

          {confirmPasswordErrorMessage && <Alert severity="error" title={confirmPasswordErrorMessage} />}
        </div>
        <DialogFooter showDivider>
          <Button
            color="primary"
            loading={confirmPasswordMutation.isLoading}
            onClick={(e) => onConfirmPassword(e)}>
            {t("confirm")}
          </Button>
          <DialogClose />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
