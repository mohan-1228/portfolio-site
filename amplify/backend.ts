import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { listPublicJournal } from './functions/list-public-journal/resource';
import type { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';

const backend = defineBackend({
  auth,
  data,
  listPublicJournal,
});

const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.adminCreateUserConfig = {
  allowAdminCreateUserOnly: true,
};

backend.data.resources.tables['JournalEntry'].grantReadData(
  backend.listPublicJournal.resources.lambda
);

// Cast to the concrete Function type, which does support addEnvironment —
// the more generic IFunction type Amplify hands back doesn't expose it,
// even though the real underlying resource supports it fine.
(backend.listPublicJournal.resources.lambda as LambdaFunction).addEnvironment(
  'JOURNAL_TABLE_NAME',
  backend.data.resources.tables['JournalEntry'].tableName
);