import { useAppSelector } from '../../redux/hooks';
import { SingleTest } from '../single-test/SingleTest';
import styles from './Main.module.css';
import { shallowEqual } from 'react-redux';
import { useDeferredValue, useMemo } from 'react';
import { filteredTestsSelector } from '../../redux/tests.splice';
import { RunnableTest } from '../../models/test';

export const Main = () => {
    const filteredTests = useAppSelector(filteredTestsSelector, shallowEqual);
    const deferredFilteredTests = useDeferredValue(filteredTests);
    const testSuites = useMemo(() => {
        const testSuites: {
            suiteName: string;
            tests: RunnableTest[];
        }[] = [];
        for (let i = 0; i < deferredFilteredTests.length; i++) {
            const test = deferredFilteredTests[i];
            if (deferredFilteredTests[i - 1]?.suite !== test.suite) {
                testSuites.push({
                    suiteName: test.suite,
                    tests: []
                });
            }
            testSuites[testSuites.length - 1].tests.push(test);
        }
        return testSuites;
    }, [deferredFilteredTests]);
    return (
        <main className={styles.Main}>
            {deferredFilteredTests.length === 0 ? (
                <div className={styles.EmptyPlug}>Nothing found</div>
            ) : (
                testSuites.map(s => (
                    <article>
                        <h3 key={s.suiteName} className={styles.SuiteHeader}>
                            {s.suiteName}
                        </h3>
                        <ul className={styles.List}>
                            {s.tests.map(t => (
                                <SingleTest key={t.id} test={t} />
                            ))}
                        </ul>
                    </article>
                ))
            )}
        </main>
    );
};
