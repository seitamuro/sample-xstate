import { createMachine } from "xstate";

export const toggleMachine = createMachine({
  id: "toggle",
  initial: "inactive",
  states: {
    inactive: {
      on: { click: { target: "active" } },
    },
    active: {
      on: { click: { target: "inactive" } },
    },
  },
});
