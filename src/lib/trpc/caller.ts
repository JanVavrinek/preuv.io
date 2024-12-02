import { createCallerFactory } from "./init";
import { appRouter } from "./router";

const createCaller = createCallerFactory(appRouter);

export default createCaller;
