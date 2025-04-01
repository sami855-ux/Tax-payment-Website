import { FaStar } from "react-icons/fa"

export default function TestimonialCard({ rating, text, image, work, name }) {
  return (
    <div className="w-80 border border-blue-200 rounded-lg h-fit bg-blue-100 p-3 hover:bg-blue-200 transition duration-150 ease-in-out cursor-pointer">
      <section className="w-full h-20 flex gap-4 items-center px-2">
        <span className="w-16 h-16 border border-gray-100 rounded-full">
          <img
            src={image}
            alt="person"
            className="w-full h-full rounded-full object-cover"
          />
        </span>
        <div className="h-28 w-fit flex justify-center flex-col">
          <h2 className="text-gray-800 ">{name}</h2>
          <p className="text-gray-600 text-sm">{work}</p>
        </div>
      </section>
      <p className="font-light text-[15px] py-1">{text}</p>
      <div className="w-full h-10 flex space-x-1 items-center">
        {Array.from({ length: rating }, (_, i) => i + 1).map(() => (
          <FaStar size={15} color="orange" />
        ))}
      </div>
    </div>
  )
}
