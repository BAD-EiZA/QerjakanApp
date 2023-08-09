import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
  appId: "1616907",
  key: "1c486b565dce86080d62",
  secret: "d7bd9e22c74dff350610",
  cluster: 'eu',
  useTLS: true,
});

export const pusherClient = new PusherClient(
  "1c486b565dce86080d62",
  {
    
    cluster: 'eu',
  }
);
