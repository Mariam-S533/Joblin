import CompanyNavbar from "@/components/Navbar/CompanyNavbar";
import JobseekerFooter from "@/components/Footer/JobseekerFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen ">
      <CompanyNavbar />
      <main className="grow pt-24 pb-12">{children}</main>
      <JobseekerFooter />
    </div>
  );
}
