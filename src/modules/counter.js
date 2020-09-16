//effects: redux-saga 미들웨어가 수행하도록 작업을 명령하는 것
import { delay, put, takeEvery, takeLatest } from 'redux-saga/effects';

const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';
const INCREASE_ASYNC = 'counter/INCREASE_ASYNC';
const DECREASE_ASYNC = 'counter/DECREASE_ASYNC';

export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });
export const increaseAsync = () => ({ type: INCREASE_ASYNC });
export const decreaseAsync = () => ({ type: DECREASE_ASYNC });

function* increaseSaga() {
  // delay: ms초만큼 기다리도록 하는 것
  yield delay(1000);
  // put: redux-saga 미들웨어가 action을 dispatch하는 것
  yield put(increase());
}
function* decreaseSaga() {
  yield delay(1000);
  yield put(decrease());
}
export function* counterSaga() {
  // take...(action, sagaFunc): action에 대하여 sagaFunc이 호출되도록
  // takeEvery: 모든 action에 대하여 action dispatch 시 sagaFunc를 호출
  // takeLeading: 가장 먼저 들어온 action에 대하여 sagaFunc을 호출
  // takeLatest: 가장 마지막에 들어온 action에 대해서 sagaFunc을 호출
  yield takeEvery(INCREASE_ASYNC, increaseSaga);
  yield takeLatest(DECREASE_ASYNC, decreaseSaga);
}

const initialState = 0;

export default function counter(state = initialState, action) {
  switch (action.type) {
    case INCREASE:
      return state + 1;
    case DECREASE:
      return state - 1;
    default:
      return state;
  }
}
