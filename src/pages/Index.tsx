import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PlatformCards from "@/components/PlatformCards";
import GigList from "@/components/GigList";
import ScopingForm from "@/components/ScopingForm";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-14">
      <Hero />
      <PlatformCards />
      <GigList />
      <ScopingForm />
    </main>
    <Footer />
  </div>
);

export default Index;
