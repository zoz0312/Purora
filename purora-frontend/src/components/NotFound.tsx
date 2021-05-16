import {Link} from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className={'max-w-xl mx-auto p-5'}>
      <h1 className={'text-gray-800 text-4xl font-bold'}>Page Not Found</h1>
      <h2 className={'text-xl text-gray-700 mt-5'}>페이지를 찾을 수 없습니다.</h2>
      <Link to={'/'} className={'underline text-blue-700'}>메인페이지로 이동</Link>
    </div>
  )
}

export default NotFound;