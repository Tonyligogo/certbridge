import { generatePageMetadata } from "@/lib/metadata";
import { HeroSlider } from "./components/heroSlider";
import PopularCategories from "./components/categories";
import ActionCTA from "./components/cta";
import { PopularCourses } from "./components/courses";
import DeliveryFormats from "./components/deliveryFormats";
import { getLandingPageData } from "../features/landing-page/lib/landing-page";
import FeaturedCourses from "./components/featured";
import AudiencesSection from "./components/audiences";

export const metadata = generatePageMetadata({
  title: "Browse Courses",
  description: "Explore 200+ professional training courses across leadership, IT, compliance and more — delivered across Kenya.",
  path: "/",
});
const LandingPage = async() => {
  const data = await getLandingPageData();
  return (
    <div className="space-y-16">
    <HeroSlider/>
    {/* shows featured courses */}
    <FeaturedCourses courses={data.featuredCourses} />
    {/* audiences */}
    <AudiencesSection audiences={data.audiences} />
    {/* shows popular courses */}
    <PopularCourses courses={data.popularCourses} />
    <PopularCategories categories={data.categories} />
    <DeliveryFormats/>
    <ActionCTA/>
    </div>
  )
}

export default LandingPage