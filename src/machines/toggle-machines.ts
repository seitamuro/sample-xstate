import { assign, setup } from "xstate";

export enum ToggleEvent {
  CLICK,
}

enum ToggleState {
  INACTIVE = "inactive",
  ACTIVE = "active",
  FINISHED = "finished",
}

type ToggleContext = {
  count: number;
};

enum ToggleGuard {
  IS_LESS_THAN_MAX_COUNT = "isLessThanMaxCount",
}

const maxCount = 3;
export const toggleMachine = setup({
  types: {} as {
    context: ToggleContext;
  },
  actions: {
    incrementCount: assign({ count: ({ context }) => context.count + 1 }),
  },
  guards: {
    [ToggleGuard.IS_LESS_THAN_MAX_COUNT]: ({ context }) =>
      context.count < maxCount,
  },
}).createMachine({
  initial: "inactive",
  context: { count: 0 },
  states: {
    [ToggleState.INACTIVE]: {
      on: {
        click: [
          {
            target: ToggleState.ACTIVE,
            guard: ToggleGuard.IS_LESS_THAN_MAX_COUNT,
          },
        ],
      },
    },
    [ToggleState.ACTIVE]: {
      entry: assign({ count: ({ context }) => context.count + 1 }),
      after: {
        1000: [
          {
            target: ToggleState.FINISHED,
            guard: ToggleGuard.IS_LESS_THAN_MAX_COUNT,
          },
          { target: ToggleState.INACTIVE },
        ],
      },
    },
    [ToggleState.FINISHED]: {
      type: "final",
    },
  },
});
