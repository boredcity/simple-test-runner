export interface ImportedTest {
    description: string;
    run: (callback: (passed: boolean) => void) => void;
    suite: string;
}

export type TestStatus = 'notStarted' | 'running' | 'passed' | 'failed';

export interface RunnableTest extends ImportedTest {
    id: string;
    status: TestStatus;
    errorText?: string;
    isFlaky?: boolean;
    prevResultingStatus?: TestStatus;
}

export const statusToHumanReadable: Record<TestStatus, string> = {
    notStarted: 'Not started',
    running: 'Running',
    passed: 'Passed',
    failed: 'Failed'
};

export const isResultingStatus = (status: TestStatus) =>
    status === 'failed' || status === 'passed';