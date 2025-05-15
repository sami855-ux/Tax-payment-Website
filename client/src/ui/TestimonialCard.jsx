import { Star } from "lucide-react"

export default function TestimonialCard({ image, text, rating, name, work }) {
  return (
    <div className="h-full p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
      {/* Rating Stars */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={20}
            className={
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-600 mb-6 flex-1">{text}</p>

      {/* User Info */}
      <div className="flex items-center mt-auto">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
        />
        <div className="ml-4">
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-sm text-blue-600">{work}</p>
        </div>
      </div>
    </div>
  )
}
