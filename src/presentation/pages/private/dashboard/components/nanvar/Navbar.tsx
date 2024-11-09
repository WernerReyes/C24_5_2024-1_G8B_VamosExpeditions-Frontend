import { Dialog } from "primereact/dialog";
import { Menubar as MenubarPrimeReact } from "primereact/menubar";
import { ContextMenu } from "primereact/contextmenu";
import { useRef, useState } from "react";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";


interface BasicDemoProps {
    setVisible: (value: boolean) => void;
}

export const Navar = ({ setVisible }: BasicDemoProps) => {

    const [ver, setVer] = useState(false);

    const startButton = <i className="text-2xl pi pi-bars  cursor-pointer hover:text-primary" onClick={() => setVisible(true)} />;

    const endIcons = (
        <div className="flex items-center gap-7  mr-8 ">
            <i   className="pi pi-bell text-2xl  cursor-pointer hover:text-primary p-overlay-badge" style={{ fontSize: '2rem' }} onClick={() => setVer(true)} >
            <Badge value="2"></Badge>
            </i>
            <div className="relative">
                <Avatar
                    image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                    size="large"
                    shape="circle"
            
                    className="cursor-pointer"
                    onClick={(e) => cm.current?.show(e)}
                />
                
            </div>


        </div>
    );

    const items = [
        {
            label: 'Perfil',
            icon: 'pi pi-user',
            command: () => console.log('Ver perfil')
        },
        {
            label: 'Configuraciones',
            icon: 'pi pi-cog',
            command: () => console.log('Abrir configuraciones')
        },
        {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => console.log('Cerrar sesión')
        }
    ];

    const cm = useRef<any>(null); // Reference for ContextMenu

    return (
        <>
            <MenubarPrimeReact menuIcon={null} start={startButton} end={endIcons} className="fixed-menubar " />

            <ContextMenu model={items} ref={cm} className="w-64 mt-5" />

            <Dialog visible={ver} header="Notificaciones" onHide={() => { if (!ver) return; setVer(false); }} position="top-right" modal={false} className="w-96 ">
                <hr />
                <p className="mb-5">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...
                </p>
                <hr />
                
            </Dialog>
        </>
    );
};
