import Holidays from '../../pages/Holidays/Holidays';
import Header from '../Header/Header';
import AppRoutes from '../Routes/Routes';
import styles from'./App.module.scss';

function App() {
  return (
    <div className={styles.App}>
        <AppRoutes />
    </div>
  );
}


export default App;
