import SwaggerUI from 'swagger-ui'
import 'swagger-ui/dist/swagger-ui.css';
import makeLedgerlive from "../../../src/client/index";
import Transport from "../../../src/client/transport";

const transport = new Transport();
window.ledgerlive = makeLedgerlive(transport);
transport.connect();

// replace original fetch used by swagger by ledgerlive api
window.fetch = window.ledgerlive;
const ui = SwaggerUI({
  url: "/spec.json",
  dom_id: '#swagger',
});
