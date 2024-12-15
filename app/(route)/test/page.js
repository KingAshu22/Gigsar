// import logo from './bg-light.jpg';

import MainContent from "@/app/_components/MainContent";
import Sidebar from "@/app/_components/SideBar";

function App() {
  let bgLight = {
    background: "url('./images/bg-light.jpg')",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
  };
  // let bgDark = {
  //   background:  "url('./images/bg-dark.jpg')",
  //   backgroundPosition: 'center',
  //   backgroundRepeat: 'no-repeat',
  //   backgroundSize: 'cover',
  //   backgroundAttachment: 'fixed',
  // }

  return (
    <div style={bgLight}>
      <main>
        <section className="main_section mt-40">
          <div className="container grid grid-cols-12 lg:gap-10">
            {/* Sidebar */}
            <Sidebar></Sidebar>
            {/* right site */}
            <MainContent></MainContent>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
