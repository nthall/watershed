import * as Sentry from '@sentry/browser'

Sentry.init({ dsn: 'https://69327d4caef74ac694a6a76e93c96524@sentry.io/274934' });

chrome.runtime.sendMessage({'action': 'save'})
