import styles from './Spinner.module.css';

interface SpinnerProps {
    size: 's' | 'm';
}

export const Spinner = ({ size }: SpinnerProps) => (
    <figure className={`${styles.Spinner} ${styles[size]}`} />
);
