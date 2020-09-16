import * as postsAPI from '../api/posts';
import {
  // createPromiseThunk,
  reducerUtils,
  handleAsyncActions,
  // createPromiseThunkById,
  handleAsyncActionsById,
  createPromiseSaga,
  createPromiseSagaById,
} from '../lib/asyncUtills';
import { takeEvery, getContext, select } from 'redux-saga/effects';

// 요청 하나 당 액션 3개
const GET_POSTS = 'posts/GET_POSTS';
const GET_POSTS_SUCCESS = 'posts/GET_POSTS_SUCCESS';
const GET_POSTS_ERROR = 'posts/GET_POSTS_ERROR';

const GET_POST = 'posts/GET_POST';
const GET_POST_SUCCESS = 'posts/GET_POST_SUCCESS';
const GET_POST_ERROR = 'posts/GET_POST_ERROR';

const GO_TO_HOME = 'posts/GO_TO_HOME';
const CLEAR_POST = 'posts/CLEAR_POST';
const PRINT_STATE = 'posts/PRINT_STATE';

// redux-thunk로 구현
// export const getPosts = createPromiseThunk(GET_POSTS, postsAPI.getPosts);
// export const getPost = createPromiseThunkById(GET_POST, postsAPI.getPostById);
// export const goToHome = () => (dispatch, getState, { history }) => {
//   history.push('/');
// };
// redux-saga로 구현
// action creator
export const getPosts = () => ({ type: GET_POSTS });
export const getPost = (id) => ({
  type: GET_POST,
  payload: id, // API 호출 시 param으로 사용하기 위함
  meta: id, // reducer에서 처리할 때 사용하기 위함
});
export const printState = () => ({ type: PRINT_STATE });

const getPostsSaga = createPromiseSaga(GET_POSTS, postsAPI.getPosts);
const getPostSaga = createPromiseSagaById(GET_POST, postsAPI.getPostById);
export const goToHome = () => ({ type: GO_TO_HOME });
function* goToHomeSaga() {
  // index.js에서 sagaMiddleware 등록 시 context에 넣어 사용하면 됨
  const history = yield getContext('history');
  history.push('/');
}
function* printStateSaga() {
  // select: redux-saga에서 state 확인
  const state = yield select((state) => state.posts);
  console.log(state);
}
// posts 리덕스 모듈을 위한 saga를 모니터링하는 함수
export function* postsSaga() {
  yield takeEvery(GET_POSTS, getPostsSaga);
  yield takeEvery(GET_POST, getPostSaga);
  yield takeEvery(GO_TO_HOME, goToHomeSaga);
  yield takeEvery(PRINT_STATE, printStateSaga);
}

export const clearPost = () => ({ type: CLEAR_POST });

const initialState = {
  posts: reducerUtils.initial(),
  post: {},
};

const getPostsReducer = handleAsyncActions(GET_POSTS, 'posts', true);
const getPostReducer = handleAsyncActionsById(GET_POST, 'post', true);
export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      return getPostsReducer(state, action);
    case GET_POST:
    case GET_POST_SUCCESS:
    case GET_POST_ERROR:
      return getPostReducer(state, action);
    case CLEAR_POST:
      return {
        ...state,
        post: reducerUtils.initial(),
      };
    default:
      return state;
  }
}
