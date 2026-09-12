import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/NavBar';
import BgProvider from '../providers/BgProvider';
import VendorSidebar from './components/VendorSidebar';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <BgProvider>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 h-fit lg:grid-cols-4 gap-8">
          <div>
            <VendorSidebar />
          </div>
          {children}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </BgProvider>
  );
}
