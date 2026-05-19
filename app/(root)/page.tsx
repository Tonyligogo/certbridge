import { generatePageMetadata } from "@/lib/metadata";
import { HeroSlider } from "./components/heroSlider";
import PopularCategories from "./components/categories";
import ActionCTA from "./components/cta";
import { PopularCourses } from "./components/courses";
import DeliveryFormats from "./components/deliveryFormats";
import Footer from "./components/footer";

export const metadata = generatePageMetadata({
  title: "Browse Courses",
  description: "Explore 200+ professional training courses across leadership, IT, compliance and more — delivered across Kenya.",
  path: "/",
});
const LandingPage = () => {
  return (
    <>
    <HeroSlider/>
    <PopularCourses/>
    <PopularCategories/>
    <DeliveryFormats/>
    <ActionCTA/>
    <Footer/>
    </>
  )
}

export default LandingPage