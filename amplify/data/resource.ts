import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { listPublicJournal } from '../functions/list-public-journal/resource';

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

  JournalEntry: a
    .model({
      title: a.string().required(),
      date: a.date().required(),
      content: a.string().required(),
      isPublic: a.boolean().required(),
    })
    .authorization((allow) => [allow.owner()]),

  // The shape we return to the public — deliberately excludes isPublic,
  // since every entry returned by this query is public by definition.
  PublicJournalEntry: a.customType({
    id: a.string(),
    title: a.string(),
    date: a.string(),
    content: a.string(),
  }),

  // This is the door the public actually gets to walk through.
  // It's backed by our function, which we already know only ever
  // returns isPublic: true rows — no matter what's asked of it.
  listPublicJournalEntries: a
    .query()
    .returns(a.ref('PublicJournalEntry').array())
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function(listPublicJournal)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});