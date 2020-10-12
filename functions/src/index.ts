import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

export * from './app/bid/bid.call';
export * from './app/bid/bid-started.trigger';
export * from './app/result/result.call';
export * from './app/result/interim-result.call';
export * from './app/result/result-notification.trigger';
export * from './app/account/deposit.call';
export * from './app/account/withdraw.call';
export * from './app/account/transfer.call';

export * from './app/transaction/balance.trigger';

export * from './app/mail/no-funds.trigger';

export * from './app/game/version.call';

export * from './app/wbc/wbc-points.trigger';
export * from './app/wbc/join-wbc.call';
export * from './app/wbc/undo-join-wbc.call';

export * from './app/race/without-bid.call';
export * from './app/race/drivers.trigger';
export * from './app/race/open-race.trigger';

export * from './app/race/reminder.pubsub';
export * from './app/race/close-race.pubsub';

export * from './app/player/migrate-account.call';
export * from './app/player/manual-balance.call';
export * from './app/player/role.trigger';
export * from './app/player/new-player.trigger';

export * from './app/player/welcome.trigger';

