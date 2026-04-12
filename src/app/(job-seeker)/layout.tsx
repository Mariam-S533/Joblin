import JobseekerFooter from "@/components/Footer/JobseekerFooter";
import JobseekerNavbar from "@/components/Navbar/JobseekerNavbar";


export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">

      <JobseekerNavbar/>
      <main className="grow pt-24 pb-12">
        {children}
      </main>
      <JobseekerFooter/>
    </div>
  );
}