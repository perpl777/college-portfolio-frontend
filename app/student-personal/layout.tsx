import Header from "../components/header";
import StudentNav from "./components/menu";

export default function StudentLoyaut({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <section className='px-11 pt-5'>
        <StudentNav />
          {children}
      </section>
    </>
  );
}
