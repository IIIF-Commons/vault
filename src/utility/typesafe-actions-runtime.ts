export const createAction: typeof import('typesafe-actions').createAction = function createAction(type: string) {
  return function () {
    const base = { type, getType: () => type, toString: () => type };
    return (payload: any, meta: any) => ({
      ...base,
      ...(payload !== undefined && { payload }),
      ...(meta !== undefined && { meta }),
    });
  };
} as any;
