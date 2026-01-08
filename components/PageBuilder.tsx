import type { PageBuilderSection, HeroSection, PageHeroSection, AboutContentSection, ServicesContentSection, CoursesContentSection, GalleryContentSection, AnnouncementsContentSection, ContactContentSection, OurApproachSection, SeasonSection, CardsSection, ServicesSection, CTASection } from "@/types/wordpress";
import Hero from "./sections/Hero";
import PageHero from "./sections/PageHero";
import AboutContent from "./sections/AboutContent";
import ServicesContent from "./sections/ServicesContent";
import CoursesContent from "./sections/CoursesContent";
import GalleryContent from "./sections/GalleryContent";
import AnnouncementsContent from "./sections/AnnouncementsContent";
import ContactContent from "./sections/ContactContent";
import OurApproach from "./sections/OurApproach";
import Season from "./sections/Season";
import Cards from "./sections/Cards";
import Services from "./sections/Services";
import CTA from "./sections/CTA";

interface PageBuilderProps {
    sections: PageBuilderSection[];
}

export default function PageBuilder({ sections }: PageBuilderProps) {
    if (!sections || sections.length === 0) {
        return null;
    }

    return (
        <>
            {sections.map((section, index) => {
                // Render component based on fieldGroupName
                switch (section.fieldGroupName) {
                    case "PageBuilderPageBuilderHeroSectionLayout":
                        return <Hero key={index} data={section as unknown as HeroSection} />;

                    case "PageBuilderPageBuilderPageHeroSectionLayout":
                        return <PageHero key={index} data={section as unknown as PageHeroSection} />;

                    case "PageBuilderPageBuilderAboutContentSectionLayout":
                        return <AboutContent key={index} data={section as unknown as AboutContentSection} />;

                    case "PageBuilderPageBuilderServicesContentSectionLayout":
                        return <ServicesContent key={index} data={section as unknown as ServicesContentSection} />;

                    case "PageBuilderPageBuilderCoursesContentSectionLayout":
                        return <CoursesContent key={index} data={section as unknown as CoursesContentSection} />;

                    case "PageBuilderPageBuilderGalleryContentSectionLayout":
                        return <GalleryContent key={index} data={section as unknown as GalleryContentSection} />;

                    case "PageBuilderPageBuilderAnnouncementsContentSectionLayout":
                        return <AnnouncementsContent key={index} data={section as unknown as AnnouncementsContentSection} />;

                    case "PageBuilderPageBuilderContactContentSectionLayout":
                        return <ContactContent key={index} data={section as unknown as ContactContentSection} />;

                    case "PageBuilderPageBuilderOurApproachSectionLayout":
                        return <OurApproach key={index} data={section as unknown as OurApproachSection} />;

                    case "PageBuilderPageBuilderSeasonSectionLayout":
                        return <Season key={index} data={section as unknown as SeasonSection} />;

                    case "PageBuilderPageBuilderCardsSectionLayout":
                        return <Cards key={index} data={section as unknown as CardsSection} />;

                    case "PageBuilderPageBuilderServicesSectionLayout":
                        return <Services key={index} data={section as unknown as ServicesSection} />;

                    case "PageBuilderPageBuilderCtaSectionLayout":
                        return <CTA key={index} data={section as unknown as CTASection} />;

                    default:
                        console.warn(`Unknown section type: ${section.fieldGroupName}`);
                        return null;
                }
            })}
        </>
    );
}

