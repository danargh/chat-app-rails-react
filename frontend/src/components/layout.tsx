import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// export function MainLayout(): JSX.Element{
//    return (

//    )
// }

export function BaseLayout(): JSX.Element {
   return (
      <>
         <section className="wrapper">
            <h1 className="flex justify-center w-full mb-5 text-2xl font-bold">Website Perizinan Karyawan PT XYZ</h1>
            <Suspense>
               <Outlet />
            </Suspense>
         </section>
      </>
   );
}
