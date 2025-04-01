import TestimonialCard from "../util/TestimonialCard"

import per1 from "../assets/per1.png"
import per2 from "../assets/per2.png"
import per3 from "../assets/per3.png"
import per4 from "../assets/per4.png"
import per5 from "../assets/per5.png"

export default function Testimonial() {
  return (
    <div
      className="w-full min-h-[90vh] items-center py-10 flex flex-col"
      id="testimonial"
    >
      <h2 className="font-bold pb-7 text-3xl bg-gradient-to-r from-blue-500 to-[#065b8c] text-transparent bg-clip-text">
        Testimonial
      </h2>
      <div className="w-full h-fit flex items-center justify-center flex-wrap gap-4 md:px-20 lg:px-36">
        <TestimonialCard
          image={per1}
          text="Paying my taxes used to be a nightmare, but this platform made it incredibly simple. The process was smooth, and I received instant confirmation. Highly recommend!"
          rating={5}
          name="John D."
          work="Business Owner"
        />
        <TestimonialCard
          image={per2}
          text="I was worried about security, but this system is top-notch! The encryption and secure payment gateway gave me peace of mind while making my tax payment"
          rating={4}
          name=" Sarah M."
          work="Freelancer"
        />
        <TestimonialCard
          image={per3}
          text="I used to spend hours sorting out tax payments. Now, it takes just minutes! This system is a game-changer for busy professionals"
          rating={5}
          name="Alex R"
          work="Consultant"
        />
        <TestimonialCard
          image={per4}
          text="Had an issue with my payment, but the support team resolved it in minutes. Super friendly and responsive!"
          rating={4}
          name="Linda K"
          work="Entrepreneur"
        />
        <TestimonialCard
          image={per5}
          text="Even for someone like me who isn’t tech-savvy, this platform was easy to use. The step-by-step process made filing my taxes effortless!"
          rating={5}
          name="David S"
          work="Self-Employed"
        />
      </div>
    </div>
  )
}
