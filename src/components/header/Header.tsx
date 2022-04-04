import { TestStatus } from '../../models/test';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { Button } from '../button/Button';
import { shallowEqual } from 'react-redux';
import { Input } from '../input/Input';
import styles from './Header.module.css';
import { KeyboardEventHandler, useCallback, useMemo } from 'react';
import { batch } from 'react-redux';
import {
    changeTextFilter,
    changeTimeout,
    defaultTestTimeout,
    filteredTestsSelector,
    runTest
} from '../../redux/tests.splice';

export const Header = () => {
    const dispatch = useAppDispatch();
    const filteredTests = useAppSelector(filteredTestsSelector, shallowEqual);

    const { textFilter, timeout } = useAppSelector(
        ({ testsState }) => testsState
    );

    const { testsCountByStatus, totalFlaky } = useMemo(() => {
        let totalFlaky = 0;
        const testsCountByStatus = filteredTests.reduce<
            Partial<Record<TestStatus, { total: number; flaky: number }>>
        >((acc, t) => {
            if (!acc[t.status]) acc[t.status] = { total: 0, flaky: 0 };
            acc[t.status]!.total++;
            if (t.isFlaky) {
                acc[t.status]!.flaky += 1;
                totalFlaky++;
            }
            return acc;
        }, {});
        return { testsCountByStatus, totalFlaky };
    }, [filteredTests]);

    const onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = ({
        key
    }) => {
        if (key !== 'Enter') return;
        runAllTestsForFiltered(
            testsCountByStatus.failed ? 'failed' : undefined
        );
    };

    const runAllTestsForFiltered = (withStatus?: TestStatus) =>
        batch(() => {
            for (const t of filteredTests) {
                if (withStatus && t.status !== withStatus) continue;
                dispatch(runTest(t.id));
            }
        });

    const getTitle = useCallback(
        (forStatus?: TestStatus) => {
            const totalCount =
                forStatus !== undefined
                    ? testsCountByStatus[forStatus]?.total ?? 0
                    : filteredTests.length;
            const flakyCount =
                forStatus !== undefined
                    ? testsCountByStatus[forStatus]?.flaky ?? 0
                    : totalFlaky;
            let result = `${totalCount} total`;
            if (totalCount && flakyCount) {
                const flakyPercentage = (
                    (flakyCount / totalCount) *
                    100
                ).toFixed(0);
                result += `, ${flakyCount} flaky (${flakyPercentage}%)`;
            }
            return result;
        },
        [totalFlaky, filteredTests, testsCountByStatus]
    );

    return (
        <header className={styles.Header}>
            <h1 className={styles.Title}>
                🏃🏽‍♀️ Test Runner
                <Button
                    disabled={filteredTests.every(t => t.status === 'running')}
                    kind="primary"
                    mixClassName={styles.RunAllButton}
                    onClick={() => runAllTestsForFiltered()}
                >
                    {testsCountByStatus.notStarted?.total ===
                    filteredTests.length
                        ? `Run ${textFilter === '' ? 'all ' : ''}tests`
                        : `Re-run ${textFilter === '' ? 'all ' : ''}tests`}
                </Button>
                <Button
                    disabled={!testsCountByStatus.failed}
                    kind="secondary"
                    mixClassName={styles.RunAllButton}
                    onClick={() => runAllTestsForFiltered('failed')}
                >
                    Run failed tests
                </Button>
            </h1>
            <section className={styles.InfoAndSettings}>
                <ul className={styles.List}>
                    <li className={styles.ListItem} title={getTitle()}>
                        Tests total:{' '}
                        <span className={styles.Count}>
                            {filteredTests.length}
                        </span>
                    </li>
                    <li
                        className={`${styles.ListItem} ${styles.passed}`}
                        title={getTitle('passed')}
                    >
                        Tests passed:{' '}
                        <span className={styles.Count}>
                            {testsCountByStatus.passed?.total ?? 0}
                        </span>
                    </li>
                    <li className={styles.ListItem} title={getTitle('failed')}>
                        Tests failed:{' '}
                        <span className={styles.Count}>
                            {testsCountByStatus.failed?.total ?? 0}
                        </span>
                    </li>
                </ul>
                <div className={styles.InputsWrapper}>
                    <Input
                        autoFocus
                        onKeyDown={onInputKeyDown}
                        onChange={({ target: { value } }) =>
                            dispatch(changeTextFilter(value))
                        }
                        value={textFilter}
                        placeholder="Filter by path, description or status"
                        mixClassName={styles.HeaderInput}
                    />
                    <Input
                        onKeyDown={onInputKeyDown}
                        onChange={({ target: { value } }) => {
                            let intValue: number | undefined = Number.parseInt(
                                value.slice(0, 7),
                                10
                            );
                            if (Number.isNaN(intValue)) {
                                intValue = undefined;
                            }
                            dispatch(changeTimeout(intValue));
                        }}
                        value={timeout ?? ''}
                        placeholder={`Tests timeout (default: ${defaultTestTimeout}ms)`}
                        mixClassName={styles.HeaderInput}
                    />
                </div>
            </section>
        </header>
    );
};
