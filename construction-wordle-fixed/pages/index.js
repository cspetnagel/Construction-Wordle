import Head from "next/head";
import ConstructionWordle from "../components/ConstructionWordle";

export default function Home() {
  return (
    <>
      <Head>
        <title>Construction Wordle</title>
      </Head>
      <main>
        <ConstructionWordle />
      </main>
    </>
  );
}
