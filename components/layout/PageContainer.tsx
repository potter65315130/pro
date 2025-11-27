import React from 'react';
import TabBar from '../TabBar';

interface PageContainerProps {
    children: React.ReactNode;
    role: 'seeker' | 'shop';
}

export default function PageContainer({ children, role }: PageContainerProps) {
    return (
        <TabBar role={role}>
            {children}
        </TabBar>
    );
}
