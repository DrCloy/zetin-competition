import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen gap-10">
      <Link
        to="/admin"
        className="text-xl md:text-3xl hover:text-2xl md:hover:text-4xl opacity-80 hover:opacity-100 font-semibold text-uos-signature-blue"
      >
        관리자 페이지
      </Link>
      <Link
        to="/competitions"
        className="text-xl md:text-3xl hover:text-2xl md:hover:text-4xl opacity-80 hover:opacity-100 font-semibold text-uos-signature-blue"
      >
        대회 페이지
      </Link>
    </div>
  );
}
