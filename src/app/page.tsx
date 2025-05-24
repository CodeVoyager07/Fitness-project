"use client"
import Image from "next/image";
import styles from "./page.module.css";
import HomeBanner1 from "./components/HomeBanner1/HomeBanner1";
import HomeBanner2 from "./components/HomeBanner2/HomeBanner2";
// import footer from "./components/copyright/footer";

export default function Home() {
  return (
    <main className={styles.main}>
      <HomeBanner1/>
      <HomeBanner2/>
      {/* <footer/> */}
    </main>
      
  );
}
