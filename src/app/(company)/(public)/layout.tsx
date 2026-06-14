import CompanyNavbar from "@/components/Navbar/CompanyNavbar";
import JobseekerFooter from "@/components/Footer/JobseekerFooter";
import { CompanyProvider } from "@/app/context/CompanyProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CompanyProvider>
    <div className="flex flex-col min-h-screen ">
      <CompanyNavbar />
      <main className="grow pt-24 pb-12">{children}</main>
      <JobseekerFooter />
    </div>
    </CompanyProvider>
  );
}
