import styles from "@/app/page.module.css";
import Navbar from "@/app/components/navbar/navbar";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <h1>Home</h1>
      </main>
    </div>
  );
}
