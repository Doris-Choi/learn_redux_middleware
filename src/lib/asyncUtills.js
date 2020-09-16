import { call, put } from 'redux-saga/effects';

// redux-thunk의 promise
export const createPromiseThunk = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  const thunkCreator = (param) => async (dispatch) => {
    dispatch({ type });
    try {
      const payload = await promiseCreator(param);
      // FSA (Flux Standard Action)
      dispatch({
        type: SUCCESS,
        payload,
      });
    } catch (e) {
      dispatch({
        type: ERROR,
        payload: e,
        error: true,
      });
    }
  };
  return thunkCreator;
};

const defaultIdSelector = (param) => param;
export const createPromiseThunkById = (
  type,
  promiseCreator,
  idSelector = defaultIdSelector,
) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  const thunkCreator = (param) => async (dispatch) => {
    const id = idSelector(param);
    dispatch({ type, meta: id });
    try {
      const payload = await promiseCreator(param);
      // FSA (Flux Standard Action)
      dispatch({
        type: SUCCESS,
        payload,
        meta: id,
      });
    } catch (e) {
      dispatch({
        type: ERROR,
        payload: e,
        error: true,
        meta: id,
      });
    }
  };
  return thunkCreator;
};

// redux-saga의 promise
export const createPromiseSaga = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return function* saga(action) {
    try {
      const result = yield call(promiseCreator, action.payload);
      yield put({
        type: SUCCESS,
        payload: result,
      });
    } catch (e) {
      yield put({
        type: ERROR,
        error: true,
        payload: e,
      });
    }
  };
};
export const createPromiseSagaById = (type, promiseCreator) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  return function* saga(action) {
    const id = action.meta;
    try {
      const result = yield call(promiseCreator, action.payload);
      yield put({
        type: SUCCESS,
        payload: result,
        meta: id,
      });
    } catch (e) {
      yield put({
        type: ERROR,
        error: true,
        payload: e,
        meta: id,
      });
    }
  };
};

export const handleAsyncActions = (type, key, keepData) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  const reducer = (state, action) => {
    switch (action.type) {
      case type:
        return {
          ...state,
          // 첫 postList 렌더를 제외하고 postList의 최신 버전을 로딩중 표시 없이 보여주기 위함
          [key]: reducerUtils.loading(keepData ? state[key].data : null),
        };
      case SUCCESS:
        return {
          ...state,
          [key]: reducerUtils.success(action.payload),
        };
      case ERROR:
        return {
          ...state,
          [key]: reducerUtils.success(action.payload),
        };
      default:
        return state;
    }
  };
  return reducer;
};

export const handleAsyncActionsById = (type, key, keepData) => {
  const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
  const reducer = (state, action) => {
    const id = action.meta;
    switch (action.type) {
      case type:
        return {
          ...state,
          // 첫 postList 렌더를 제외하고 postList의 최신 버전을 로딩중 표시 없이 보여주기 위함
          [key]: {
            ...state[key],
            [id]: reducerUtils.loading(
              keepData ? state[key][id] && state[key][id].data : null,
            ),
          },
        };
      case SUCCESS:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.success(action.payload),
          },
        };
      case ERROR:
        return {
          ...state,
          [key]: {
            ...state[key],
            [id]: reducerUtils.error(action.payload),
          },
        };
      default:
        return state;
    }
  };
  return reducer;
};

export const reducerUtils = {
  initial: (data = null) => ({
    data,
    loading: false,
    error: null,
  }),
  loading: (prevState = null) => ({
    data: prevState,
    loading: true,
    error: null,
  }),
  success: (data) => ({
    data,
    loading: false,
    error: null,
  }),
  error: (error) => ({
    data: null,
    loading: false,
    error,
  }),
};
