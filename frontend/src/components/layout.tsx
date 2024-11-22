import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export function BaseLayout(): JSX.Element {
   return (
      <>
         <section>
            <h1>Website Chat Room Action Cable Ruby on Rails</h1>
            <button style={{ padding: '8px 16px', backgroundColor: 'gray', border: 'none' }}>
               <a style={{ fontSize: '16px', color: 'black', fontWeight: 'bold', textDecoration: 'none' }} href="/chat-room">
                  Chat Room
               </a>
            </button>
            <Suspense>
               <Outlet />
            </Suspense>
         </section>
      </>
   );
}
