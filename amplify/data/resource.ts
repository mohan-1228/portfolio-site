import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  GuestbookEntry: a
    .model({
      name: a.string().required(),
      message: a.string().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  ContactSubmission: a
    .model({
      name: a.string().required(),
      email: a.string().required(),
      message: a.string().required(),
    })
    .authorization((allow) => [allow.publicApiKey().to(['create'])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});