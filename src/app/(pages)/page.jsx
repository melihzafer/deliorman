import AppData from "@data/app.json";
import HomePageContent from "@components/home/HomePageContent";

/** @type {import('next').Metadata} */
export const metadata = {
  title: {
    default: "Начало",
  },
  description: AppData.settings.siteDescription,
};

function Home() {
  return <HomePageContent />;
}
export default Home;
