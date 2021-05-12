import React, { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link } from 'react-router-dom';
import TokenForm from "@components/modal/token-form";

interface MySummonerDetailProps {
  show: boolean;
  setShow: (value: boolean) => void;
  detailData: {
    id: number;
    summonerName?: string;
    token?: string;
    lastMatchUpdateAt?: Date;
  };
  getMySummoner: Function;
}

const MySummonerDetail: React.FC<MySummonerDetailProps> = (
  {
    show,
    setShow,
    detailData,
    getMySummoner,
  }
) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={show}
        onClose={setShow}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white">
                <div className="sm:flex sm:items-start">
                  <div className="w-full text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h1" className="text-xl leading-6 font-medium text-white p-4 bg-personal-2">
                      소환사 상세보기
                    </Dialog.Title>
                    <div className={'overflow-hidden py-2 px-4'}>
                      <table className="table-auto w-full">
                        <thead>
                        <tr className={'bg-personal-1 text-white'}>
                          <th className={'w-1/3 px-1 py-2'}>이름</th>
                          <th>정보</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td className={'px-1 py-2'}>소환사 고유 ID</td>
                          <td>{ detailData.id }</td>
                        </tr>
                        <tr className="bg-gray-100">
                          <td className={'px-1 py-2'}>소환사 명</td>
                          <td>
                            <span>{ detailData.summonerName }</span>
                          </td>
                        </tr>
                        <tr>
                          <td className={'px-1 py-2'}>소환사 토큰 여부</td>
                          <td className={''}>
                            { detailData.token ? '있음' : '없음' }
                          </td>
                        </tr>
                          <tr>
                            <td colSpan={2}>
                              <TokenForm
                                summonerId={detailData.id}
                              />
                            </td>
                          </tr>
                        { detailData.token && (
                          <tr className={'bg-gray-100'}>
                            <td className={'px-1 py-2'}>마지막 전적<br/>업데이트 날짜</td>
                            <td>{ detailData.lastMatchUpdateAt }</td>
                          </tr>
                        )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row justify-end">
                <Link
                  to={`/modify/summoner/${detailData.id}`}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-400 text-base font-medium text-white mb-1 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gary-500 sm:ml-3 sm:w-auto sm:text-sm sm:mb-0"
                >수정하기</Link>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-400 text-base font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShow(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default MySummonerDetail;