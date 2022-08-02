export function combineReducers(
  reducers: Record<any, (state: any, action: any) => any> = {}
): (state: any, action: any) => any {
  const reducerKeys = Object.keys(reducers);
  return function combination(state = {}, action) {
    let hasChanged = false;
    const nextState: any = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      nextState[key] = reducers[key](state[key], action);
      hasChanged = hasChanged || nextState[key] !== state[key];
    }
    return hasChanged ? nextState : state;
  };
}
