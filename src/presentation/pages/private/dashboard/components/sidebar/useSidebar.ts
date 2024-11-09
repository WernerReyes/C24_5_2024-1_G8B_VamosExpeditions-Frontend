import { useState, useEffect } from 'react';

export const useSidebar = () => {
    // Recuperar el estado inicial de localStorage o usar 'true' como valor por defecto
    const [visible, setVisible] = useState(() => {
        const savedVisible = localStorage.getItem('sidebarVisible');
        return savedVisible !== null ? JSON.parse(savedVisible) : true; // Cambiar a false si deseas que esté oculto por defecto
    });

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 1000;

            if (isMobile && visible) {
                setVisible(false); // Ocultar si estamos en móvil
            } else if (!isMobile && !visible) {
                setVisible(true); // Mostrar en pantallas grandes
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [visible]);

    // Guardar el estado de la visibilidad en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem('sidebarVisible', JSON.stringify(visible));
    }, [visible]);

    return { 
        visible, 
        setVisible 
    };
    
};