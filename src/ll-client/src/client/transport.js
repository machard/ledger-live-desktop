import { v4 as uuidv4 } from 'uuid';

export default class Transport {
  handlers = {};
  
  connect = () => {
    window.addEventListener('message', this.handler);
  };
  disconnect = () => {
    window.removeEventListener('message', this.handler);
  };

  handler = (message) => {
    const handler = this.handlers[message.data.id];
    if (handler && message.data.from === "LedgerLive") {
      delete this.handlers[message.data.id];
      handler(
        new Response(
          new Blob(
            [JSON.stringify(message.data.body, null, 2)],
            {type : 'application/json'}
          ),
          {
            status: message.data.status,
          }
        )
      );
    }
  };

  send = (url, params) => {
    return new Promise(resolve => {
      const id = uuidv4();
      window.parent.postMessage({
        id,
        url,
        params: JSON.parse(JSON.stringify(params)),
        from: "LedgerLiveClient"
      }, "*");
      this.handlers[id] = resolve;
    });
  };
};
