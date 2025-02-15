import { assign, createMachine } from "xstate";

export enum ToggleEvent {
  CLICK,
}

enum ToggleState {
  INACTIVE = "inactive",
  ACTIVE = "active",
  FINISHED = "finished",
}

const maxCount = 3;
export const toggleMachine = createMachine({
  id: "toggle",
  initial: "inactive",
  context: { count: 0 },
  states: {
    [ToggleState.INACTIVE]: {
      on: {
        click: [
          {
            target: ToggleState.ACTIVE,
            guard: ({ context }) => context.count < maxCount, // 状態遷移の条件
          },
          {
            target: ToggleState.FINISHED,
            guard: ({ context }) => context.count >= maxCount, // 状態遷移の条件
          },
        ],
      },
    },
    [ToggleState.ACTIVE]: {
      entry: assign({ count: ({ context }) => context.count + 1 }),
      after: { 1000: { target: ToggleState.INACTIVE } }, // 2秒後にinactiveに遷移
    },
    [ToggleState.FINISHED]: {
      type: "final",
    },
  },
});
