import { configureStore } from '@reduxjs/toolkit';
import { testsReducer } from './tests.splice';

export const store = configureStore({
    reducer: {
        testsState: testsReducer
    },

    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                // NOTE: we're storing non-serializable tests with callbacks in state;
                // we might have problems with re-hydration or making store persistant,
                // but that is not something we need for a test-runner
                ignoredPaths: ['testsState.tests']
            }
        })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
