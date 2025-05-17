import { motion } from "framer-motion"
import TestimonialCard from "../ui/TestimonialCard"
import per1 from "../assets/per1.png"
import per2 from "../assets/per2.png"
import per3 from "../assets/per3.png"
import per4 from "../assets/per4.png"
import per5 from "../assets/per5.png"

export default function Testimonial() {
  const testimonials = [
    {
      image: per1,
      text: "Paying my taxes used to be a nightmare, but this platform made it incredibly simple. The process was smooth, and I received instant confirmation. Highly recommend!",
      rating: 5,
      name: "Bantelay M.",
      work: "Business Owner",
    },
    {
      image: per2,
      text: "I was worried about security, but this system is top-notch! The encryption and secure payment gateway gave me peace of mind while making my tax payment.",
      rating: 4,
      name: "Seid M.",
      work: "Freelancer",
    },
    {
      image: per3,
      text: "I used to spend hours sorting out tax payments. Now, it takes just minutes! This system is a game-changer for busy professionals.",
      rating: 5,
      name: "Mohammed A.",
      work: "Consultant",
    },
    {
      image: per4,
      text: "Had an issue with my payment, but the support team resolved it in minutes. Super friendly and responsive!",
      rating: 4,
      name: "Samuel K.",
      work: "Entrepreneur",
    },
    {
      image: per5,
      text: "Even for someone like me who isn't tech-savvy, this platform was easy to use. The step-by-step process made filing my taxes effortless!",
      rating: 5,
      name: "Senayit S.",
      work: "Self-Employed",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section
      className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50"
      id="testimonial"
    >
      <div className="max-w-7xl mx-auto">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text pb-2">
            What Our Users Say
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of businesses and individuals across the
            country
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="h-full"
            >
              <TestimonialCard
                image={testimonial.image}
                text={testimonial.text}
                rating={testimonial.rating}
                name={testimonial.name}
                work={testimonial.work}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      </div>
    </section>
  )
}
