import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_PUBLIC_KEY!,
  secret: process.env.PUSHER_PRIVATE_KEY!,
  cluster: 'eu',
  useTLS: true,
});

export const pusherClient = new PusherClient(
  "1c486b565dce86080d62",
  {
    
    cluster: 'eu',
  }
);
