import AdminAuthForm from 'form/admin-auth-form';
import { useCallback, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function Admin() {
  const [payload, setPayload] = useState(null);
  return (
    <>
      <div className="float-left block fixed left-0 top-0 p-6 w-80 h-full overflow-x-hidden overflow-y-auto bg-light border-r box-border">
        <h3 className="text-3xl font-medium mb-2 leading-tight">
          ZETIN Competiton Admin Page
        </h3>
        <hr className="my-4 border-t box-content overflow-visible" />
        <AdminAuthForm
          onAuthChange={useCallback((p: any) => setPayload(p), [])}
        />
        <hr className="my-4 border-t box-content overflow-visible" />
        <div className="flex flex-col pl-0 rounded-md">
          <NavLink
            to="/admin/competitions"
            className={({ isActive }) =>
              (isActive
                ? 'bg-blue-500 text-white font-semibold'
                : 'bg-white text-sky-500 hover:text-blue-500 font-normal') +
              'relative block px-3 py-4 rounded-md border border-shadow no-underline hover:underline'
            }
          >
            라인트레이서 대회 페이지 관리
          </NavLink>
          <NavLink
            to="/admin/files"
            className={({ isActive }) =>
              (isActive
                ? 'bg-blue-500 text-white font-semibold'
                : 'bg-white text-sky-500 hover:text-blue-500 font-normal') +
              'relative block px-3 py-4 border-t-0 border-shadow no-underline hover:underline'
            }
          >
            포스터 및 파일 관리
          </NavLink>
          <NavLink
            to="/admin/participants"
            className={({ isActive }) =>
              (isActive
                ? 'bg-blue-500 text-white font-semibold'
                : 'bg-white text-sky-500 hover:text-blue-500 font-normal') +
              'relative block px-3 py-4 border-t-0 border-shadow no-underline hover:underline'
            }
          >
            대회 참가자 관리
          </NavLink>
          <NavLink
            to="/admin/counter"
            className={({ isActive }) =>
              (isActive
                ? 'bg-blue-500 text-white font-semibold'
                : 'bg-white text-sky-500 hover:text-blue-500 font-normal') +
              'relative block px-3 py-4 rounded-md border-t-0 border-shadow no-underline hover:underline'
            }
          >
            계수기 관리
          </NavLink>
        </div>
      </div>
      <div className="ml-80 p-6">
        {payload ? (
          <div>
            <Outlet />
          </div>
        ) : (
          <div>
            <h1 className="text-5xl mb-2 leading-tight ">Blocked!</h1>
            <p className="block ">관리자 로그인이 필요합니다.</p>
          </div>
        )}
      </div>
    </>
  );
}
