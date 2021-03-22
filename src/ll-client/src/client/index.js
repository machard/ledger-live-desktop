export default (transport) => (url, data) => {
  return transport.send(url, data);
};
