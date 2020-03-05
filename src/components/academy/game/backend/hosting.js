import {isDev} from './user';

const LIVE_ASSETS_HOST = 'https://s3-ap-southeast-1.amazonaws.com/source-academy-assets/';

// placeholder URL
// const TEST_ASSETS_HOST = 'https://localhost:8080/source-academy-assets/';
const TEST_ASSETS_HOST = 'https://sa2021assets.blob.core.windows.net/sa2021-assets/';

// placeholder predicate
export const ASSETS_HOST = LIVE_ASSETS_HOST;
export const STORY_HOST = isDev() ? TEST_ASSETS_HOST : LIVE_ASSETS_HOST;