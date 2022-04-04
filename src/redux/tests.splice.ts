import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import tests from '../__all-tests';
import {
    ImportedTest,
    isResultingStatus,
    RunnableTest,
    statusToHumanReadable,
    TestStatus
} from '../models/test';
import { generateUUID } from '../utils/generateUuid';
import { RootState } from './store';

const runnableTests: RunnableTest[] = tests.map(test => {
    return {
        ...(test as ImportedTest),
        id: generateUUID(),
        status: 'notStarted'
    };
});

export interface TestsState {
    tests: RunnableTest[];
    textFilter: string;
    timeout?: number;
}

export const defaultTestTimeout = 1000; // milliseconds
const testsTimeoutLocalStorageKey = '__tests_timeout';
const savedTimeout = Number.parseInt(
    localStorage[testsTimeoutLocalStorageKey],
    10
);

const initialState: TestsState = {
    tests: runnableTests,
    textFilter: '',
    timeout: Number.isNaN(savedTimeout) ? undefined : savedTimeout
};

export const runTest = createAsyncThunk(
    'tests/runTest',
    async (testId: string, thunkAPI) => {
        const {
            testsState: { tests, timeout = defaultTestTimeout }
        } = thunkAPI.getState() as RootState;
        const test = tests.find(t => t.id === testId);
        if (!test || test.status === 'running') return;
        thunkAPI.dispatch(changeTestStatus({ id: testId, status: 'running' }));
        const timeoutPromise = new Promise((res, rej) =>
            setTimeout(
                () =>
                    rej(
                        new Error(`Test took over ${timeout}ms (test timeout)`)
                    ),
                timeout
            )
        );
        // TODO: run in WebWorker pool for better performance
        const testPromise = new Promise(res => test.run(res));
        try {
            const result = await Promise.race([testPromise, timeoutPromise]);
            thunkAPI.dispatch(
                changeTestStatus({
                    id: testId,
                    status: result ? 'passed' : 'failed'
                })
            );
        } catch (err) {
            thunkAPI.dispatch(
                changeTestStatus({
                    id: testId,
                    status: 'failed',
                    errorText: `${err}`
                })
            );
        }
    }
);

export const testsSlice = createSlice({
    name: 'tests',
    initialState,
    reducers: {
        changeTextFilter: (state, action: PayloadAction<string>) => {
            state.textFilter = action.payload;
        },
        changeTimeout: (state, action: PayloadAction<number | undefined>) => {
            state.timeout = action.payload;
            localStorage[testsTimeoutLocalStorageKey] = action.payload;
        },
        changeTestStatus: (
            state,
            {
                payload: { id, status, errorText }
            }: PayloadAction<{
                id: string;
                status: TestStatus;
                errorText?: string;
            }>
        ) => {
            for (const t of state.tests) {
                if (t.id === id) {
                    t.status = status;
                    t.errorText = errorText;
                    if (!t.isFlaky && isResultingStatus(status)) {
                        if (!t.prevResultingStatus) {
                            t.prevResultingStatus = status;
                        } else if (t.prevResultingStatus !== status) {
                            delete t.prevResultingStatus;
                            t.isFlaky = true;
                        }
                    }
                    break;
                }
            }
        }
    }
});

export const { changeTextFilter, changeTestStatus, changeTimeout } =
    testsSlice.actions;

export const testsReducer = testsSlice.reducer;

// TODO: memoize selector
export const filteredTestsSelector = ({
    testsState: { textFilter, tests }
}: RootState) => {
    const filterTextNormalized = textFilter.trim().toLocaleLowerCase();
    return tests.filter(
        t =>
            t.description // is included in description
                .toLocaleLowerCase()
                .includes(filterTextNormalized) ||
            t.suite.toLocaleLowerCase().includes(filterTextNormalized) ||
            statusToHumanReadable[t.status] // or starts with status
                .toLocaleLowerCase()
                .startsWith(filterTextNormalized)
    );
};