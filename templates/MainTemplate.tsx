import About from "../components/About/About"
import Clients from "../components/Clients/Clients"
import HeadIndex from "../components/HeadIndex/Head"
import Hero from "../components/Hero/Hero"
import Navigation from "../components/Navigation/Navigation"
import SectionDivider from "../components/SectionDivider/SectionDivider"

const MainTemplate: React.FC = () => {
  return (
    <>
      <HeadIndex />
      <Navigation />
      <Hero />
      <SectionDivider side='right'/>
      <About />
      <SectionDivider side='right'/>
      <Clients />
    </>
  );
}

export default MainTemplate;