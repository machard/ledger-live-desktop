import dbMiddleware from "~/renderer/middlewares/db";
import createStore from "~/renderer/createStore";

export default createStore({ dbMiddleware });
