import React, { Suspense } from 'react';
import { createElement } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { BaseLayout, RootError } from '../components';
import Chat from './chat';

// application routes
export const router = createBrowserRouter([
   {
      path: '',
      element: <BaseLayout />,
      errorElement: <RootError />,
      children: [
         {
            path: 'chat-room',
            element: (
               <Suspense fallback={<div>Loading...</div>}>
                  <Chat />
               </Suspense>
            ),
         },
      ],
   },
]);

export function Router(): JSX.Element {
   return createElement(RouterProvider, { router });
}

// Clean up on module reload (HMR)
// https://vitejs.dev/guide/api-hmr
if (import.meta.hot) {
   import.meta.hot.dispose(() => router.dispose());
}
