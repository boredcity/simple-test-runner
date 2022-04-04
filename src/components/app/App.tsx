import { Header } from '../header/Header';
import { Main } from '../main/Main';
import styles from './App.module.css';

export function App() {
    return (
        <div className={styles.App}>
            <Header />
            <Main />
        </div>
    );
}
