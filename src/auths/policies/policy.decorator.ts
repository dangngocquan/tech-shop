import { SetMetadata } from '@nestjs/common';

export const CHECK_POLICIES_KEY = 'check-policies';
export const CheckPolicies = (...policyNames: string[]) => SetMetadata(CHECK_POLICIES_KEY, policyNames);