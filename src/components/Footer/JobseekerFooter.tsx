import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = {
  services: ["Find job", "Create resume", "Search company", "Pricing Plan"],
  links: ["Blog", "Help center", "Contact us", "Privacy Policy", "About us"],
};

function JobseekerFooter() {
  return (
    <>
      <div className="border-t border-gray-300 text-gray-600 bg-muted/50">
        <div className=" container mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 md:grid-cols-2 gap-10 md:gap-5 px-4 py-10 ">
            <div className="col-span-1 space-y-4">
              <Image src="/darklogo.svg" width={120} height={60} alt="Joplin" />
              <p className=" text-sm mt-2 text-gray-500 ">
                Joblin is a smart job search and recruitment platform that
                connects job seekers with employers. With fast search,
                professional resume building, and intelligent matching, Jablin
                makes hiring and job hunting easy and efficient.
              </p>
            </div>
            <div className=" space-y-4  px-2">
              <h3 className="text-gray-900">Our Services</h3>
              <ul className=" space-y-2 ">
                {FOOTER_LINKS.services.map((service, index) => (
                  <li
                    key={index}
                    className=" text-sm text-gray-500 hover:text-gray-800 cursor-pointer "
                  >
                    <Link href="#">{service}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className=" space-y-4  px-2">
              <h3 className="text-gray-900">Links</h3>
              <ul className=" space-y-2 px-2 ">
                {FOOTER_LINKS.links.map((link, index) => (
                  <li
                    key={index}
                    className=" text-sm text-gray-500 hover:text-gray-800 cursor-pointer "
                  >
                    <Link href="#">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className=" space-y-4 px-2 ">
              <h3 className="text-gray-900">Contact Us</h3>
              <div className="flex items-center gap-5">
                <span>
                  <Link href="#">
                    <i className="fa-brands fa-facebook" />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <i className="fa-brands fa-linkedin" />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <i className="fa-brands fa-x-twitter" />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <i className="fa-brands fa-instagram" />
                  </Link>
                </span>
                <span>
                  <Link href="#">
                    <i className="fa-brands fa-whatsapp" />
                  </Link>
                </span>
              </div>
              <p className=" flex items-center text-[15px] mb-1 gap-1">
                {" "}
                <MapPin size={15} />
                <span>123 Main Street, Anytown, USA</span>
              </p>
              <p className=" flex items-center text-[15px] gap-1">
                {" "}
                <Phone size={15} />
                <span>+686-654-5335</span>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#F0F1F3]">
          <div className="text-sm text-gray-500 py-4 flex flex-col md:flex-row justify-between items-center container mx-auto px-4 b ">
            <p>&copy; 2026 Joblin. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Image
                src="/stripe.png"
                width={50}
                height={30}
                alt="Payment Methods"
              />
              <Image
                src="/visa.jpg"
                width={50}
                height={30}
                alt="Secure Payment"
              />
              <Image
                src="/paypal.webp"
                width={50}
                height={30}
                alt="Secure Payment"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobseekerFooter;
