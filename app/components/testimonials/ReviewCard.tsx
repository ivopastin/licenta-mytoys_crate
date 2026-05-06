import React from "react";
import Image from "next/image";

type Review = {
  id: number;
  name: string;
  image: string;
  review: string;
  rating: number;
};

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col w-[400px] h-[380px] rounded-[16px] bg-white p-[10px] gap-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
      <div className="relative h-[280px] w-full bg-[#716458] rounded-[12px] flex flex-col p-[14px]">
        <p className="text-[20px] font-medium tracking-tight leading-[22px]">
          &quot;{review.review}&quot;
        </p>
        <div className="absolute flex flex-row bottom-[14px] right-[14px] -space-x-2">
          {Array.from({ length: review.rating - 1 }, (_, i) => (
            <Image
              key={i}
              src="/images/star.png"
              alt="star"
              width={32}
              height={32}
            />
          ))}
          <Image src="/images/star.png" alt="star" width={32} height={32} />
        </div>
      </div>

      <div className="flex flex-row text-black justify-between w-full h-auto">
        <div className="flex flex-row gap-[10px] h-full px-[10px]">
          <Image src={review.image} alt="client" width={48} height={48} />
          <div className="flex flex-col gap-[5px]">
            <p className="text-[16px] font-semibold tracking-tight leading-[17px]">
              {review.name}
            </p>
            <p className="text-[14px] text-[#7d7d7d] font-medium tracking-tight leading-[15px]">
              Client
            </p>
          </div>
        </div>

        <Image
          src="/icons/quotation-mark-right-icon.svg"
          alt="quote"
          width={32}
          height={32}
          className="h-fit mr-[10px]"
          style={{ filter: "invert(38%) sepia(18%) saturate(600%) hue-rotate(340deg) brightness(85%) contrast(90%)" }}
        />
      </div>
    </div>
  );
}

export default ReviewCard;
