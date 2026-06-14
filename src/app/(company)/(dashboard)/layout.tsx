import DashboardHeader from "@/components/Navbar/DashboardHeader";
import CompanySidebar from "@/components/Sidebar/CompanySidebar";
import { CompanyProvider } from "@/app/context/CompanyProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return ( 
    <CompanyProvider>
    <div className="h-screen overflow-hidden text-[#101825] bg-stone-50 flex  px-6 py-4">
      <CompanySidebar />
      <div className="flex-1 min-h-0 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-stone-50">
          <div className="px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
    </CompanyProvider>
  );
}
