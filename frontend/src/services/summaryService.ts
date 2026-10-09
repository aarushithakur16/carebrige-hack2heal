
import type {  FollowUpSummary  } from '../types';
import { mockSummary } from '../data/summary';
export const getFollowUpSummary = async (): Promise<FollowUpSummary> => {
  return new Promise(resolve => setTimeout(() => resolve({ ...mockSummary }), 800));
};
