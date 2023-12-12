'use client';

import isAuth from '@components/is-authenticated';
import React from 'react';

const Dashboard = () => {
  return <div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 text-white lg:px-8">Hello</div>;
};

export default isAuth(Dashboard);
