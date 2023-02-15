import type { MissingProfile } from '@logto/schemas';
import { SignInIdentifier } from '@logto/schemas';
import type { TFuncKey } from 'react-i18next';

import SecondaryPageWrapper from '@/components/SecondaryPageWrapper';
import useSendVerificationCode from '@/hooks/use-send-verification-code';
import type { VerificationCodeIdentifier } from '@/types';
import { UserFlow } from '@/types';

import IdentifierProfileForm from '../IdentifierProfileForm';
import SocialIdentityNotification from './SocialIdentityNotification';

export type VerificationCodeProfileType = Exclude<MissingProfile, 'username' | 'password'>;

type Props = {
  missingProfile: VerificationCodeProfileType;
  notification?: TFuncKey;
};

export const pageContent: Record<
  VerificationCodeProfileType,
  {
    title: TFuncKey;
    description: TFuncKey;
  }
> = {
  email: {
    title: 'description.link_email',
    description: 'description.link_email_description',
  },
  phone: {
    title: 'description.link_phone',
    description: 'description.link_phone_description',
  },
  emailOrPhone: {
    title: 'description.link_email_or_phone',
    description: 'description.link_email_or_phone_description',
  },
};

const formSettings: Record<
  VerificationCodeProfileType,
  { defaultType: VerificationCodeIdentifier; enabledTypes: VerificationCodeIdentifier[] }
> = {
  email: {
    defaultType: SignInIdentifier.Email,
    enabledTypes: [SignInIdentifier.Email],
  },
  phone: {
    defaultType: SignInIdentifier.Phone,
    enabledTypes: [SignInIdentifier.Phone],
  },
  emailOrPhone: {
    defaultType: SignInIdentifier.Email,
    enabledTypes: [SignInIdentifier.Email, SignInIdentifier.Phone],
  },
};

const SetEmailOrPhone = ({ missingProfile, notification }: Props) => {
  const { onSubmit, errorMessage, clearErrorMessage } = useSendVerificationCode(UserFlow.continue);

  const handleSubmit = (identifier: SignInIdentifier, value: string) => {
    // Only handles email and phone
    if (identifier === SignInIdentifier.Username) {
      return;
    }

    return onSubmit({ identifier, value });
  };

  return (
    <SecondaryPageWrapper {...pageContent[missingProfile]} notification={notification}>
      <IdentifierProfileForm
        autoFocus
        errorMessage={errorMessage}
        clearErrorMessage={clearErrorMessage}
        {...formSettings[missingProfile]}
        onSubmit={handleSubmit}
      />
      <SocialIdentityNotification missingProfileTypes={formSettings[missingProfile].enabledTypes} />
    </SecondaryPageWrapper>
  );
};

export default SetEmailOrPhone;