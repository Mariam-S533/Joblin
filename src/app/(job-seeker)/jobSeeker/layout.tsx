import ProfileSidbar from "@/components/jobSeeker/ProfileSidbar";



export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen gap-6 w-[90%] mx-auto lg:containar">

      <aside className=" ">
        <ProfileSidbar/>
      </aside>

      <main className="flex-1 p-5 overflow-hidden ">
        {children}
      </main>

    </div>
  );
}