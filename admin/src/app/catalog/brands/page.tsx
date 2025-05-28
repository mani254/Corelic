"use client";

import Brands from "@/components/Brand/Brands";
import { Suspense } from "react";

const BrandsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Brands />
    </Suspense>
  );
};

export default BrandsPage;
