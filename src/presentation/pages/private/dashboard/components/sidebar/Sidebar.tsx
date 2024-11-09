import { Sidebar as SidebarPrimeReact } from 'primereact/sidebar';
import { Image } from "@/presentation/components";

import { PanelMenu } from 'primereact/panelmenu';



interface BasicDemoProps {
    visible: boolean;
    setVisible: (value: boolean) => void;
}

export default function Sidebar({ visible, setVisible }: BasicDemoProps) {
    const customHeader = (
        
        <Image src="/images/logo.png" alt="Logo" width='150' height='200'  />
        
        
    );
    const items = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            items: [
                {
                    label: 'Styled',
                    icon: 'pi pi-eraser',
                    //url: '/theming'
                },
                {
                    label: 'Unstyled',
                    icon: 'pi pi-heart',
                    //url: '/unstyled'
                }
            ]
        },
        {
            label: 'Cotizaciones',
            icon: 'pi  pi-book',

        },
        {
            label: 'Hoteles',
            icon: 'pi pi-star',
            items: [
                {
                    label: 'React.js',
                    icon: 'pi pi-star',
                   // url: 'https://react.dev/'
                },
                {
                    label: 'Vite.js',
                    icon: 'pi pi-bookmark',
                    //url: 'https://vite.dev/'
                }
            ]
        },
        {
            label: 'Servicios',
            icon: 'pi pi-cog',
            items: [
                {
                    label: 'React.js',
                    icon: 'pi pi-star',
                   // url: 'https://react.dev/'
                },
                {
                    label: 'Vite.js',
                    icon: 'pi pi-bookmark',
                    //url: 'https://vite.dev/'
                }
            ]
        },
        {
            label: 'Usuarios',
            icon: 'pi pi-users',
            items: [
                {
                    label: 'React.js',
                    icon: 'pi pi-star',
                   // url: 'https://react.dev/'
                },
                {
                    label: 'Vite.js',
                    icon: 'pi pi-bookmark',
                    //url: 'https://vite.dev/'
                }
            ]
        }
    ];

    return (
        <SidebarPrimeReact
            header={customHeader}
            onHide={() => setVisible(false)} 
            visible={visible}
            position="left"
            className='w-72'
            showCloseIcon={true}
            blockScroll={false}
            modal={false}
            dismissable={window.innerWidth < 1000}

        >
           <hr className="mt-3 mb-2 border-2 border-gray-300 " />
            <PanelMenu model={items} className='w-full' />
            
        </SidebarPrimeReact>
    );
}
