import { defineFunction } from '@aws-amplify/backend';

export const listPublicJournal = defineFunction({
  name: 'list-public-journal',
  entry: './handler.ts',
  resourceGroupName: 'data',
});