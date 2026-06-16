import JobseekerFooter from "@/components/Footer/JobseekerFooter";
import JobseekerNavbar from "@/components/Navbar/JobseekerNavbar";
import ProfilesContextProvider from "../context/ProfilesProvider";
import SaveJobsContextProvider from "../context/SaveJobsContext";


export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen ">

    <ProfilesContextProvider>
      <SaveJobsContextProvider>
       <JobseekerNavbar/>
      <main className="grow pt-30 pb-12 ">
        {children}
      </main>
        <JobseekerFooter/>
       </SaveJobsContextProvider>
      </ProfilesContextProvider>

    </div>
  );
}