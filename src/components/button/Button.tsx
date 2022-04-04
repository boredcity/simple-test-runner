import styles from './Button.module.css';

interface ButtonProps
    extends Omit<
        React.DetailedHTMLProps<
            React.ButtonHTMLAttributes<HTMLButtonElement>,
            HTMLButtonElement
        >,
        'className'
    > {
    mixClassName?: string;
    kind: 'primary' | 'secondary';
}

export const Button = ({ mixClassName, kind, ...props }: ButtonProps) => {
    const disabled = props.disabled || !props.onClick;
    return (
        <button
            {...props}
            disabled={disabled}
            className={`${mixClassName} ${styles.Button} ${styles[kind]}`}
        />
    );
};
