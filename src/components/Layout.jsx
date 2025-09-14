import { Outlet } from 'react-router-dom';
import SideNavBar from './SideNavBar.jsx';
import BottomNavBar from './BottomNavBar.jsx';

//Cria o "elemento pai" de todas as seções, elas serão renderizadas dentro deste layout,
//que denpendendo do tamanho da tela, renderiza o navbar no inferior ou lateral
const Layout = () => {
  return (
    <div className="w-full h-screen bg-white dark:bg-gray-900 flex font-sans">
      <SideNavBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto w-full h-full pb-16 md:pb-0">
          {/* O Outlet renderiza o componente da rota filha (HubPage, Finta, etc.) */}
          <Outlet />
        </main>
        <BottomNavBar />
      </div>
    </div>
  );
};

export default Layout;
