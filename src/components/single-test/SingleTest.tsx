import { Button } from '../button/Button';
import styles from './SingleTest.module.css';
import { Spinner } from '../spinner/Spinner';
import { RunnableTest, statusToHumanReadable } from '../../models/test';
import { runTest } from '../../redux/tests.splice';
import { useAppDispatch } from '../../redux/hooks';
import { capitalize } from '../../utils/capitalize';

interface SingleTestProps {
    test: RunnableTest;
}

export const SingleTest = ({ test }: SingleTestProps) => {
    const dispatch = useAppDispatch();
    return (
        <li className={`${styles.SingleTest} ${styles[test.status]}`}>
            <Button
                kind="primary"
                mixClassName={styles.Button}
                disabled={test.status === 'running'}
                onClick={() => dispatch(runTest(test.id))}
            >
                {test.status === 'notStarted' ? 'Run test' : 'Re-run test'}
            </Button>
            <h4 className={styles.Description}>
                {capitalize(test.description)}{' '}
                {test.isFlaky && <span title="Flaky">🎲</span>}
            </h4>
            <code className={`${styles.Info} ${styles[test.status]}`}>
                <div className={styles.Status}>
                    {test.errorText ?? statusToHumanReadable[test.status]}
                </div>
                {test.status === 'running' ? <Spinner size="s" /> : null}
                <br />
            </code>
        </li>
    );
};
