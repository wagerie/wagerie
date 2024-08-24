import { icons } from '@/public/assets/icons/icons';
import React from 'react'

function AuthTestimonials() {
  return (
    <div className="shadow-testimonial bg-[#3E3838] rounded-3xl p-8 flex flex-col gap-8 items-center  mx-auto">
      <span className="w-12 h-12 rounded-full bg-[#F56630] flex items-center justify-center">
        {icons.message_bold}
      </span>
      <div className="flex flex-col gap-6 items-center w-[290px]">
        <p className="text-white font-normal text-center">
          Wagerie has completely transformed the way I win products and cash
          prizes. it is a game changer in the world of digitalized raffle draw
          system
        </p>

        <div className="flex flex-col gap-1 items-center">
          <h1 className="text-sm font-semibold text-white">Ariana Grande</h1>
          <p className="text-xs font-normal text-[#A29999] ">
            Visual Designer, Google
          </p>
        </div>
      </div>
      <div className="flex gap-2.5">
        <span className="rounded-full w-2 h-2 bg-[#F56630]"></span>
        <span className="rounded-full w-2 h-2 bg-[#645D5D]"></span>
        <span className="rounded-full w-2 h-2 bg-[#645D5D]"></span>
      </div>
    </div>
  );
}

export default AuthTestimonials