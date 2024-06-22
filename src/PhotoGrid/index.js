import React from 'react';
import alm_green from '../assets/alm_green.jpg';
import alm_men from '../assets/alm_men.jpg';
import alm_ladies_1 from '../assets/alm_ladies_1.jpg';
import alm_red from '../assets/alm_red.jpg';
import alm_group from '../assets/alm_group.jpg';
import alm_ladies_white from '../assets/alm_ladies_white.jpg';

export default function PhotoGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
      <div className="flex flex-col items-center animate__animated animate__fadeInDown">
        <img
          src={alm_group}
          width={300}
          height={300}
          alt="Photo 1"
          className="w-full h-full object-cover rounded-lg"
        />
        {/* <p className="mt-2 text-sm text-muted-foreground">Caption 1</p> */}
      </div>
      <div className="flex flex-col items-center animate__animated animate__fadeInDown">
        <img
          src={alm_men}
          width={300}
          height={300}
          alt="Photo 2"
          className="w-full h-full object-cover rounded-lg"
        />
        {/* <p className="mt-2 text-sm text-muted-foreground">Caption 2</p> */}
      </div>
      <div className="flex flex-col items-center animate__animated animate__fadeInUp">
        <img
          src={alm_green}
          width={300}
          height={300}
          alt="Photo 3"
          className="w-full h-full object-cover rounded-lg"
        />
        {/* <p className="mt-2 text-sm text-muted-foreground">Caption 3</p> */}
      </div>
      <div className="flex flex-col items-center animate__animated animate__fadeInUp">
        <img
          src={alm_red}
          width={300}
          height={300}
          alt="Photo 4"
          className="w-full h-full object-cover rounded-lg"
        />
        {/* <p className="mt-2 text-sm text-muted-foreground">Caption 4</p> */}
      </div>
      {/* <div className="flex flex-col items-center">
        <img
          src={alm_green}
          width={300}
          height={300}
          alt="Photo 5"
          className="w-full h-full object-cover rounded-lg"
        />
        <p className="mt-2 text-sm text-muted-foreground">Caption 5</p>
      </div> */}
      {/* <div className="flex flex-col items-center">
        <img
          src={alm_ladies_white}
          width={300}
          height={300}
          alt="Photo 6"
          className="w-full h-full object-cover rounded-lg"
        />
        <p className="mt-2 text-sm text-muted-foreground">Caption 6</p>
      </div> */}
    </div>
  );
}
