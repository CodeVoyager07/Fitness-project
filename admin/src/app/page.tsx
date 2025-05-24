import Image from 'next/image';
import styles from './page.module.css';
import Pages from './pages/addworkout/page'; // Correct import for the Page component

export default function Home() {
  return (
    <main className={styles.main}>
      <Pages /> {/* Render the Page component here */}
    </main>
  );
}
