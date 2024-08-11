import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';

export type PostMsgFormDataParam = FromSchema<typeof schemas.PostMsg.formData>;
export type PostMsgMetadataParam = FromSchema<typeof schemas.PostMsg.metadata>;
export type PostMsgResponse2XX = FromSchema<typeof schemas.PostMsg.response['2XX']>;
