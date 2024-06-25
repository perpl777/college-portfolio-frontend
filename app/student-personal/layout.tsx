import Header from "../components/header";
import StudentNav from "./components/menu";
import { UserProvider } from "./components/context";

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
        <UserProvider>
          {children}
        </UserProvider>
      </section>
    </>
  );
}
