import { assign, fromPromise, setup } from "xstate";

export enum ToggleEvent {
  CLICK = "click",
  RESET = "reset",
}

enum ToggleState {
  INACTIVE = "inactive",
  ACTIVE = "active",
  FINISHED = "finished",
  RESETTING = "resetting",
}

type ToggleContext = {
  count: number;
};

enum ToggleGuard {
  IS_LESS_THAN_MAX_COUNT = "isLessThanMaxCount",
  IS_GREATER_THAN_MAX_COUNT = "isGreaterThanMaxCount",
}

enum ToggleAction {
  INCREMENT_COUNT = "incrementCount",
}

enum ToggleActor {
  RESET_COUNT = "resetCount",
}

const maxCount = 3;
export const toggleMachine = setup({
  types: {} as {
    context: ToggleContext;
  },
  actions: {
    [ToggleAction.INCREMENT_COUNT]: assign({
      count: ({ context }) => context.count + 1,
    }),
  },
  guards: {
    [ToggleGuard.IS_LESS_THAN_MAX_COUNT]: ({ context }) =>
      context.count < maxCount,
    [ToggleGuard.IS_GREATER_THAN_MAX_COUNT]: ({ context }) =>
      context.count >= maxCount,
  },
  actors: {
    [ToggleActor.RESET_COUNT]: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 1000));

      if (Math.random() > 0.5) {
        throw new Error("Failed to reset count");
      }

      return {
        count: 0,
      };
    }),
  },
}).createMachine({
  initial: "inactive",
  context: { count: 0 },
  states: {
    [ToggleState.INACTIVE]: {
      on: {
        [ToggleEvent.CLICK]: {
          target: ToggleState.ACTIVE,
          guard: ToggleGuard.IS_LESS_THAN_MAX_COUNT,
        },
        [ToggleEvent.RESET]: {
          target: ToggleState.RESETTING,
        },
      },
    },
    [ToggleState.ACTIVE]: {
      entry: ToggleAction.INCREMENT_COUNT,
      after: {
        1000: [
          {
            target: ToggleState.FINISHED,
            guard: ToggleGuard.IS_GREATER_THAN_MAX_COUNT,
          },
          { target: ToggleState.INACTIVE },
        ],
      },
    },
    [ToggleState.RESETTING]: {
      invoke: {
        src: ToggleActor.RESET_COUNT,
        onDone: {
          target: ToggleState.INACTIVE,
          actions: assign({ count: ({ event }) => event.output.count }),
        },
        onError: {
          target: ToggleState.INACTIVE,
        },
      },
    },
    [ToggleState.FINISHED]: {
      type: "final",
    },
  },
});
