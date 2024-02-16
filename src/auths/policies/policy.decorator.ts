import { SetMetadata } from '@nestjs/common';

export const IS_POLICY_KEY = 'check-policies';
export const CheckPolicies = (policyNames: string[]) => SetMetadata(IS_POLICY_KEY, policyNames);