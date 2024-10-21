import styles from "./page.module.css";
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="/table1"
            rel="noopener noreferrer"
          >
            Table
          </a>
          <a
            className={styles.primary}
            href="/table2"
            rel="noopener noreferrer"
          >
            Table With 2 Levels
          </a>
          <a
            className={styles.primary}
            href="/table3"
            rel="noopener noreferrer"
          >
            Table With 3 Levels
          </a>
          <a
            className={styles.secondary}
            href="https://github.com/Wenying0808/table-component"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
            Github
          </a>
        </div>
      </main>
    </div>
  );
}
