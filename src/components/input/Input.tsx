import styles from './Input.module.css';

export const Input = ({
    mixClassName,
    ...props
}: Omit<
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >,
    'className'
> & { mixClassName?: string }) => {
    const disabled = props.disabled || !props.onChange;
    return (
        <input
            {...props}
            disabled={disabled}
            className={`${mixClassName} ${styles.Input}`}
        />
    );
};
